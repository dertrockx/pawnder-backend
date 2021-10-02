import { Request, Response, Router } from "express";
import { InstitutionHandler } from "@handlers";
import { Institution } from "@models";
import { errors, ModelException } from "@constants";
import { files } from "@utils";
import { upload } from "@middlewares";

export const InstitutionEndpoint = Router();

interface GetNearbyInstitutionsQuery {
	nearby?: boolean;
	centerLat?: string;
	centerLong?: string;
	distance?: string;
}

interface InstitutionBody {
	name?: string;
	email?: string;
	password?: string;
	description?: string;
	locationLat?: string;
	locationLong?: string;
	contactNumber?: string;
	photoURL?: string;
}

const getInstitutions = async (
	req: Request<any, any, any, GetNearbyInstitutionsQuery>,
	res: Response
) => {
	let { nearby, centerLat, centerLong, distance } = req.query;

	const handler = new InstitutionHandler();
	let institutions: Institution[];
	try {
		if (nearby && (!centerLat || !centerLong || !distance))
			return res.status(400).json({
				msg: "Please make sure centerLat, centerLong, and distance are provided and are integers",
			});

		institutions = !nearby
			? await handler.getInstitutions()
			: await handler.getNearbyInstitutions(
					{
						lat: parseFloat(centerLat),
						long: parseFloat(centerLong),
					},
					parseFloat(distance)
			  );

		return res.json({ institutions, count: institutions.length });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const getSingleInstitution = async (req: Request, res: Response) => {
	const { id } = req.params;
	const handler = new InstitutionHandler();
	try {
		const institution = await handler.getInstitution(id);

		return res.json({ institution });
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "Institution not found" });
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const createInstitution = async (
	req: Request<any, any, InstitutionBody, any>,
	res: Response
) => {
	const { email, password } = req.body;
	const body = req;
	if (!email || !password)
		return res.status(400).json({ msg: "Email and password are required." });

	const handler = new InstitutionHandler();
	try {
		const institution = await handler.create(email, {
			email,
			password,
			name: null,
			description: null,
			locationLat: null,
			locationLong: null,
			contactNumber: null,
			photoURL: null
		});

		return res.status(201).json({ institution });
	} catch (error) {
		console.log(error);
		if (error.code === ModelException.INSTITUTION_ALREADY_EXISTS)
			return res.status(400).json(error);
			
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
}

// TODO: still need to validate and sanitize data sent to this endpoint

const updateInstitution = async (
	req: Request<any, any, InstitutionBody, any>,
	res: Response
) => {
	const { id } = req.params;
	const { file } = req;
	const handler = new InstitutionHandler();
	try {
		let institution = await handler.update(id, req.body);

		if (file) {
			const result = await files.uploader.upload(file.path, {
				folder: `/institution/${id}`,
				public_id: "avatarPhoto",
			})
			institution = await handler.setPhotoUrl(id, result.secure_url);
		}

		return res.json({ institution });
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "Institution not found" });

		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const deleteInstitution = async (req: Request, res: Response) => {
	const { id } = req.params;

	const handler = new InstitutionHandler();
	try {
		const institution = await handler.delete(id);
		return res.json({
			msg: `Institution '(${id}):${institution.name}' successfully deleted`,
		});
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "Institution not found" });

		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

InstitutionEndpoint.get("/", getInstitutions);
InstitutionEndpoint.get("/:id", getSingleInstitution);
InstitutionEndpoint.post("/", createInstitution);
InstitutionEndpoint.put("/:id", updateInstitution);
InstitutionEndpoint.delete("/:id", deleteInstitution);
