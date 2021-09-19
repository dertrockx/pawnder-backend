import { IgnoredPetHandler, IgnoredPetBody } from "handlers";
import { Request, Response, Router } from "express";
import { errors, ModelException } from "@constants";

export const IgnoredEndpoint = Router();

const create = async (
	req: Request<any, any, IgnoredPetBody>,
	res: Response
) => {
	const { petId, userId } = req.body;
	if (!petId || !userId) return res.status(400).json({ msg: "Invalid fields" });
	const handler = new IgnoredPetHandler();
	try {
		const entry = await handler.create({ petId, userId });
		return res.status(201).json({ entry });
	} catch (err) {
		console.log(err);
		if (err.code === ModelException.ENTRY_ALREADY_EXISTS)
			return res
				.status(400)
				.json({ code: err.code, msg: "Entry already exists" });
		if (err.message === errors.NOT_FOUND)
			return res
				.status(404)
				.json({ msg: "User and/or Pet entities not found" });
		return res
			.status(500)
			.json({ msg: "Server error. Please check logs or contact admin" });
	}
};

const list = async (req: Request, res: Response) => {
	const handler = new IgnoredPetHandler();
	try {
		const ignored = await handler.list({});
		return res.json({ data: ignored });
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ msg: "Server error. Please check logs or contact admin" });
	}
};

IgnoredEndpoint.post("/", create);
IgnoredEndpoint.get("/", list);
