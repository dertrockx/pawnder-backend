import { AuthException, AuthTypeEnum, errors } from "@constants";
import { AuthHandler } from "@handlers";
import { Request, Response, NextFunction } from "express";
import { Institution, User } from "@models";
import { InstitutionHandler } from "@handlers";

interface CustomRequest extends Request {
	model: User | Institution;
	type: AuthTypeEnum;
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
		const { model, type } = handler.validateToken(token);
		Object.assign(req, { model, type });
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
		if (institution) next();
		else console.log("no institution");
	} catch (err) {
		if (err.message === errors.NOT_FOUND)
			return res.status(401).json({ msg: "Request unauthorized" });
		console.log(err);
	}

	return next();
};

export const allowedMethods = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const allowedMethods = [
		"OPTIONS",
		"HEAD",
		"CONNECT",
		"GET",
		"POST",
		"PUT",
		"DELETE",
		"PATCH",
	];

	if (!allowedMethods.includes(req.method)) {
		return res.status(405).send(`${req.method} not allowed.`);
	}
	next();
};
