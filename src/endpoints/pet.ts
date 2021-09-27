import { PetHandler, Filters, PetBody, PhotoHandler } from "@handlers";
import {
	AnimalTypeEnum,
	errors,
	PetPhotoTypeEnum,
	PhotoOwnerEnum,
} from "@constants";
import { Request, Response, Router } from "express";
import { upload, isAuthenticated, isAuthorized } from "@middlewares";
import { files, validRequiredFields } from "@utils";
import { Photo } from "@models";

export const PetEndpoint = Router();

// type Queries = Omit<Filters, "location">;
interface Queries extends Omit<Filters, "location"> {
	centerLat?: string;
	centerLong?: string;
	distance?: string;
}

const getPet = async (req: Request, res: Response) => {
	const { id } = req.params;
	const handler = new PetHandler();
	const photoHanlder = new PhotoHandler();
	try {
		const pet = await handler.getPet(id);
		const photos = await photoHanlder.list({ petId: pet.id });
		Object.assign(pet, { photos });
		return res.json({ pet });
	} catch (error) {
		if (error.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: `Pet with id ${id} not found` });
		console.log(error);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const getPets = async (req: Request<any, any, any, Queries>, res: Response) => {
	const petHandler = new PetHandler();
	const photoHandler = new PhotoHandler();
	const filters: Filters = {};
	const {
		institutionId,
		animalType,
		userId,
		nearby = false,
		...rest
	} = req.query;

	if (institutionId) {
		if (typeof institutionId === "string" && isNaN(parseInt(institutionId)))
			return res
				.status(400)
				.json({ msg: "`institutionId` in url params should be a number" });
		Object.assign(filters, { institutionId });
	}
	if (animalType) {
		if (!Object.values(AnimalTypeEnum).includes(animalType))
			return res.status(400).json({
				msg: "Invalid `animalType` data passed, please check documentation",
			});
		Object.assign(filters, { animalType });
	}
	if (userId) {
		if (typeof userId === "string" && isNaN(parseInt(userId)))
			return res
				.status(400)
				.json({ msg: "`userId` in url params should be a number" });
		Object.assign(filters, { userId });
	}
	if (nearby) {
		const { centerLat, centerLong, distance } = rest;
		if (!centerLat || !centerLong || !distance)
			return res.status(400).json({
				msg: "Please make sure centerLat, centerLong, and distance are provided and are integers",
			});
		Object.assign(filters, {
			nearby: true,
			location: {
				lat: centerLat,
				long: centerLong,
				distance,
			},
		});
	}

	try {
		let pets = await petHandler.getPets(filters);
		const petPhotoPromises = pets.map(async (pet) => {
			let photos = await photoHandler.list({ petId: pet.id });
			// return url to maps instead of returning the entire Photo object
			return { ...pet, photos };
		});
		const result = await Promise.all(petPhotoPromises);
		return res.json({ pets: result, count: pets.length });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const createPet = async (
	req: Request<any, any, PetBody, any>,
	res: Response
) => {
	// req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
	//
	// e.g.
	//  req.files['avatar'][0] -> File
	//  req.files['gallery'] -> Array
	//
	const { files: photos, body } = req;

	if (!photos) return res.status(400).json({ msg: "Files are required!" });

	// body validation
	const requiredFields = [
		"institutionId",
		"name",
		"weight",
		"height",
		"age",
		"breed",
		"animalType",
		"medicalHistory",
		"sex",
		"otherInfo",
		"action",
	];
	if (!validRequiredFields(requiredFields, body))
		return res.status(400).json({
			msg: `The ff. fields are required (${requiredFields.join(
				", "
			)}). Please check your input and try again`,
		});

	const petHandler = new PetHandler();
	const photoHandler = new PhotoHandler();

	try {
		const pet = await petHandler.create(body);
		// console.log(Object.values(photos));

		const mainPhoto = photos["mainPhoto"][0];
		// first create main photo
		let mainPhotoObj = await photoHandler.create({
			petId: pet.id,
			url: "",
			owner: PhotoOwnerEnum.Pet,
			type: PetPhotoTypeEnum.Main,
		});
		// then upload main photo
		const result = await files.uploader.upload(mainPhoto.path, {
			folder: `/pet/${pet.id}`,
			public_id: `pet-${pet.id}-photo-${mainPhotoObj.id}`,
		});

		// lastly update mainPhotoObject's url
		mainPhotoObj = await photoHandler.update(
			mainPhotoObj.id,
			result.secure_url
		);

		// now upload all other photos

		const others: any[] = photos["others"];

		const imagePromises: Promise<Photo>[] = others.map(
			async (photo): Promise<Photo> => {
				let newPhoto = await photoHandler.create({
					petId: pet.id,
					url: "",
					owner: PhotoOwnerEnum.Pet,
					type: PetPhotoTypeEnum.Other,
				});
				const result = await files.uploader.upload(photo.path, {
					folder: `/pet/${pet.id}/`,
					public_id: `pet-${pet.id}-photo-${newPhoto.id}`,
				});
				newPhoto = await photoHandler.update(newPhoto.id, result.secure_url);
				return newPhoto;
			}
		);

		const otherImagesResponses = await Promise.all(imagePromises);

		console.log(mainPhotoObj);
		console.log(otherImagesResponses);
		return res
			.status(201)
			.json({ pet, images: [mainPhotoObj, ...otherImagesResponses] });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "Server error. Please contact admi" });
	}
};

//solution: create a separate endpoint to update individual images instead
const updatePet = async (
	req: Request<any, any, Partial<PetBody>, any>,
	res: Response
) => {
	const { id } = req.params;
	const petHandler = new PetHandler();

	try {
		const pet = await petHandler.update(id, req.body);
		// console.log(pet);
		return res.json({ msg: `Pet with id ${id} updated`, pet });
	} catch (error) {
		console.log(error);
		if (error.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: `Pet with id ${id} not found` });
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const deletePet = async (req: Request, res: Response) => {
	const { id } = req.params;
	const petHandler = new PetHandler();
	const photoHandler = new PhotoHandler();
	try {
		await petHandler.delete(id);
		await photoHandler.deletePetPhotos(parseInt(id));
		return res.json({ msg: `Successfully deleted pet ${id} and its photos` });
	} catch (error) {
		console.log(error);
		if (error.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: `Pet with id ${id} not found` });
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

PetEndpoint.get("/", isAuthenticated, getPets);
PetEndpoint.get("/:id", [isAuthenticated, isAuthorized], getPet);
PetEndpoint.post(
	"/",
	// upload.single("mainPhoto"),
	// upload.array("photos", 4),
	[
		isAuthenticated,
		isAuthorized,
		upload.fields([
			{
				name: "mainPhoto",
				maxCount: 1,
			},
			{
				name: "others",
				maxCount: 4,
			},
		]),
	],

	createPet
);
PetEndpoint.put("/:id", [isAuthenticated, isAuthorized], updatePet);
PetEndpoint.delete("/:id", [isAuthenticated, isAuthorized], deletePet);
