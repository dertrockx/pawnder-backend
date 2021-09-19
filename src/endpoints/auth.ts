import { AuthHandler } from "@handlers";
import { Request, Response, Router } from "express";
import { AuthException, AuthTypeEnum } from "@constants";
import { isAuthenticated, isAuthorized } from "@middlewares";
export const AuthEndpoint = Router();

interface ReqBody {
	email: string;
	password: string;
	type: AuthTypeEnum;
}

const institutionLogin = async (
	req: Request<any, any, ReqBody>,
	res: Response
) => {
	const { email, password, type } = req.body;
	console.log(Object.values(AuthTypeEnum).includes(type));
	if (!email || !password || !Object.values(AuthTypeEnum).includes(type))
		return res.status(400).json({
			code: AuthException.INVALID_FIELDS,
			msg: "Email, password, and type fields are required",
		});

	const handler = new AuthHandler();
	try {
		const institution = await handler.login(email, password, type);

		const token = await handler.generateToken(institution);
		const { id } = institution;
		return res.json({ institution: { id, email }, token });
	} catch (err) {
		console.log(err);
		return res.status(401).json({
			code: AuthException.INCORRECT_EMAIL_PASSWORD,
			msg: "Email and/or password fields are invalid",
		});
	}
};

const authenticatedRoute = (req: Request, res: Response) => {
	return res.json({ msg: "Congrats! You are authenticated" });
};

const authorizedRoute = (req: Request, res: Response) => {
	return res.json({ msg: "Congrats! You are authorized" });
};

const refreshToken = async (
	req: Request<any, any, { token: string }>,
	res: Response
) => {
	const { token } = req.body;
	if (!token) return res.status(400).json({ msg: "`token` field is required" });
	const handler = new AuthHandler();
	try {
		const model = await handler.validateToken(token);
		const newToken = await handler.generateToken(model);
		return res.json({ newToken });
	} catch (error) {
		console.log(error);
		return res.status(401).json(error);
	}
};

AuthEndpoint.post("/login", institutionLogin);
AuthEndpoint.post("/refresh_token", refreshToken);
AuthEndpoint.get("/test/authentication", isAuthenticated, authenticatedRoute);
// u must pass both middlewares and at this specific order
AuthEndpoint.get(
	"/test/authorization",
	[isAuthenticated, isAuthorized],
	authorizedRoute
);
