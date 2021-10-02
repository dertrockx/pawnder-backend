import { AuthHandler } from "@handlers";
import { Request, Response, Router } from "express";
import { AuthException, AuthTypeEnum } from "@constants";
import { isAuthenticated, isAuthorized } from "@middlewares";
import { Institution, User } from "@models";

export const AuthEndpoint = Router();

interface ReqBody {
	email: string;
	password: string;
	type: AuthTypeEnum;
}

const login = async (req: Request<any, any, ReqBody>, res: Response) => {
	const { email, password, type } = req.body;
	console.log(Object.values(AuthTypeEnum).includes(type));
	if (!email || !password || !Object.values(AuthTypeEnum).includes(type))
		return res.status(400).json({
			code: AuthException.INVALID_FIELDS,
			msg: "Email, password, and type fields are required",
		});

	const handler = new AuthHandler();
	try {
		const model = await handler.login(email, password, type);

		const token = await handler.generateToken(model, type);

		let response:
			| {
					model: User | Institution;
					token: string;
					type: AuthTypeEnum;
					token_expiry: number;
			  }
			| {} = {};
		Object.assign(response, {
			model,
			type,
			token,
			token_expiry: handler.ACCESS_TOKEN_EXPIRY * 1000,
		});
		const expires = new Date(Date.now() + handler.REFRESH_TOKEN_EXPIRY * 1000);
		console.log(expires);
		// save refresh token to cookies
		res.cookie("refreshToken", token.refresh, {
			secure: process.env.NODE_ENV !== "development",
			httpOnly: true,
			expires,
		});

		return res.json(response);
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

const refreshEndooint = async (
	req: Request<any, any, { token: string }>,
	res: Response
) => {
	if (!req.cookies || !req.cookies.refreshToken) {
		return res.status(400).json({ msg: "No token provided in cookies" });
	}
	// const { token } = req.body;
	// if (!token) return res.status(400).json({ msg: "`token` field is required" });
	const handler = new AuthHandler();
	try {
		// const model = await handler.validateToken(token);
		// const newToken = await handler.generateToken(model);
		// return res.json({ newToken });
		const { refreshToken } = req.cookies;
		const { model, type } = await handler.validateToken(refreshToken);
		const { auth, refresh } = await handler.generateToken(model, type);
		const expires = new Date(Date.now() + handler.REFRESH_TOKEN_EXPIRY * 1000);
		console.log(expires);

		res.cookie("refreshToken", refresh, {
			secure: process.env.NODE_ENV !== "development",
			httpOnly: true,
			expires,
		});

		return res.json({
			token: auth,
			model,
			type,
			token_expiry: handler.ACCESS_TOKEN_EXPIRY * 1000,
		});
	} catch (error) {
		console.log(error);
		return res.status(401).json(error);
	}
};

// an endpoint to clear refreshToken in cookies
const logout = async (req: Request, res: Response) => {
	res.clearCookie("refreshToken");
	return res.json({ msg: "Cookies cleared." });
};

AuthEndpoint.post("/login", login);
AuthEndpoint.get("/refresh_token", refreshEndooint);
AuthEndpoint.get("/test/authentication", isAuthenticated, authenticatedRoute);
// u must pass both middlewares and at this specific order
AuthEndpoint.get(
	"/test/authorization",
	[isAuthenticated, isAuthorized],
	authorizedRoute
);

AuthEndpoint.post("/logout", logout);
