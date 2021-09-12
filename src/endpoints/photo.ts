import { PhotoHandler } from "@handlers";
import { PhotoOwnerEnum, PetPhotoTypeEnum, errors } from "@constants";
import { Request, Response, Router } from "express";
import { upload } from "@middlewares";
import { files } from "@utils";
export const PhotoEndpoint = Router();

interface PhotoBody {
	petId: string;

	owner?: PhotoOwnerEnum;
	type?: PetPhotoTypeEnum;
}

const createPhoto = async (
	req: Request<any, any, PhotoBody, any>,
	res: Response
) => {
	if (!req.file)
		return res.status(400).json({ msg: "`photo` field is required" });
	const {
		petId,
		owner = PhotoOwnerEnum.Pet,
		type = PetPhotoTypeEnum.Other,
	} = req.body;
	if (!petId) return res.status(400).json({ msg: "`petId` field is required" });
	const handler = new PhotoHandler();
	try {
		const count = await handler.count(parseInt(petId));
		if (count >= 5)
			return res
				.status(403)
				.json({ msg: "Only a max. of 5 photos can be uploaded for each pet" });

		let photo = await handler.create({
			owner,
			type,
			petId: parseInt(petId),
			url: "",
		});
		const result = await files.uploader.upload(req.file.path, {
			folder: `/pet/${petId}`,
			public_id: `pet-${petId}-photo-${photo.id}`,
		});
		photo = await handler.update(photo.id, result.secure_url);
		return res.status(201).json({ photo });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const updatePhoto = async (
	req: Request<any, any, PhotoBody, any>,
	res: Response
) => {
	if (!req.file)
		return res.status(400).json({ msg: "`photo` field is required" });
	const { petId } = req.body;
	if (!petId) return res.status(400).json({ msg: "`petId` field is required" });
	const { id } = req.params;
	const handler = new PhotoHandler();
	try {
		// checking to confirm if photo exists
		let photo = await handler.get(id);
		// upload new file
		const result = await files.uploader.upload(req.file.path, {
			folder: `/pet/${petId}`,
			public_id: `pet-${petId}-photo-${photo.id}`,
		});
		photo = await handler.update(photo.id, result.secure_url);
		return res.status(201).json({ photo });
	} catch (error) {
		if (error.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: `Photo with id ${id} not found` });
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const deletePhoto = async (req: Request, res: Response) => {
	const { id } = req.params;
	const handler = new PhotoHandler();
	try {
		await handler.delete(id);
		return res.json({ msg: `Photo with id '${id}' deleted` });
	} catch (error) {
		if (error.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: `Photo with id ${id} not found` });
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

PhotoEndpoint.post("/", upload.single("photo"), createPhoto);
PhotoEndpoint.put("/:id", upload.single("photo"), updatePhoto);
PhotoEndpoint.delete("/:id", deletePhoto);
