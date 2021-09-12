import {
	ApplicationHandler,
	ApplicationBody,
	ApplicationFilters,
} from "@handlers";
import { Request, Response, Router } from "express";
import { errors, ApplicationStatusEnum } from "@constants";
export const ApplicationEndpoint = Router();

const getApplications = async (
	req: Request<any, any, any, ApplicationFilters>,
	res: Response
) => {
	const { petId } = req.query;
	const handler = new ApplicationHandler();
	const applications = await handler.list({ petId });
	return res.json({ applications });
};

const createApplication = async (
	req: Request<any, any, { petId: string; userId: string }, any>,
	res: Response
) => {
	const { petId, userId } = req.body;

	if (!(petId && userId) || isNaN(parseInt(petId)) || isNaN(parseInt(userId)))
		return res.status(400).json({
			msg: `The ff. fields are required and should be a number: petId, userId`,
		});

	const handler = new ApplicationHandler();
	try {
		const application = await handler.create({ petId, userId });
		return res.status(201).json({ application });
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({
				msg: `Either pet with id ${petId} or user with id ${userId} does not exist`,
			});
		return res
			.status(500)
			.json({ msg: "Server error. Please check logs or contact admin" });
	}
};

const updateApplication = async (
	req: Request<any, any, Pick<ApplicationBody, "status">>,
	res: Response
) => {
	const { id } = req.params;
	const { status } = req.body;
	// input validation
	if (!status)
		return res.status(400).json({ msg: "`status` field is required in body" });
	if (!Object.values(ApplicationStatusEnum).includes(status)) {
		return res.status(400).json({
			msg: `'status' only accepts any of the ff. values: ${Object.values(
				ApplicationStatusEnum
			).join(", ")} `,
		});
	}
	const handler = new ApplicationHandler();
	try {
		const application = await handler.update(id, status);
		return res.json({ application });
	} catch (err) {
		if (err.message === errors.NOT_FOUND)
			return res
				.status(404)
				.json({ msg: `Application with id '${id}' not found` });
		console.log(err);
		return res
			.status(500)
			.json({ msg: "Server error. Please check logs or contact admin" });
	}
};

const deleteApplication = async (req: Request, res: Response) => {
	const { id } = req.params;
	const handler = new ApplicationHandler();
	try {
		await handler.delete(id);
		return res.json({
			msg: `Successfully deleted application with id '${id}'`,
		});
	} catch (err) {
		if (err.message === errors.NOT_FOUND)
			return res
				.status(404)
				.json({ msg: `Application with id '${id}' not found` });
		console.log(err);
		return res
			.status(500)
			.json({ msg: "Server error. Please check logs or contact admin" });
	}
};

ApplicationEndpoint.get("/", getApplications);
ApplicationEndpoint.post("/", createApplication);
ApplicationEndpoint.put("/:id", updateApplication);
ApplicationEndpoint.delete("/:id", deleteApplication);
