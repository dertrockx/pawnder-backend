import { AuthException, errors } from "@constants";
import { AuthHandler } from "@handlers";
import { Request, Response, NextFunction } from "express";
import { Institution, User } from "@models";
import { InstitutionHandler } from "@handlers";

interface CustomRequest extends Request {
	model: User | Institution;
}

export const isAuthenticated = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { authorization = "" } = req.headers;
	const handler = new AuthHandler();

	const [_ = null, token = null] = authorization.match(/^Bearer (.+)$/) || [];

	if (!token)
		return res.status(401).json({
			code: AuthException.ACCESS_DENIED,
			message: "Access is denied",
		});
	try {
		const model = handler.validateToken(token);
		req.model = model;
	} catch (error) {
		return res.status(401).json(error);
	}

	return next();
};

export const isAuthorized = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { model } = req;

	if (!model) {
		return res.status(401).json({
			code: AuthException.ACCESS_DENIED,
			message: "Access is denied",
		});
	}
	const handler = new InstitutionHandler();
	try {
		const { email } = model;
		const institution = await handler.getInstitution("", { where: { email } });
		if (institution) console.log(institution);
		else console.log("no institution");
	} catch (err) {
		if (err.message === errors.NOT_FOUND)
			return res.status(401).json({ msg: "Request unauthorized" });
		console.log(err);
	}

	return next();
};
