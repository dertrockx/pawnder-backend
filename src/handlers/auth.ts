import { User, Institution } from "@models";
import { AuthException, Exception, AuthTypeEnum } from "@constants";
import { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SelectQueryBuilder } from "typeorm";
export interface SessionToken {
	readonly auth: string;
	readonly refresh: string;
}

export interface TokenPayload {
	readonly model: User | Institution;
	readonly iat: number; // issued at
}
// TODO: check if we should refactor this class
export class AuthHandler<T extends User | Institution> {
	readonly TOKEN_SECRET: string = process.env.TOKEN_SECRET || "tokensecret";
	readonly TOKEN_EXPIRY: number = parseInt(process.env.TOKEN_EXPIRY) || 300; // 5 minutes

	async login(email: string, password: string, type: AuthTypeEnum): Promise<T> {
		let query: SelectQueryBuilder<T>;
		// let obj: T;
		if (type === AuthTypeEnum.INSTITUTION) {
			query = Institution.createQueryBuilder("model") as SelectQueryBuilder<T>;
		} else {
			query = User.createQueryBuilder("model") as SelectQueryBuilder<T>;
		}

		const obj = (await query
			.addSelect("model.password")
			.where("model.email = :email", { email })
			.getOne()) as T;

		if (!obj)
			throw new Exception(
				type === AuthTypeEnum.INSTITUTION
					? AuthException.INSTITUTION_NOT_FOUND
					: AuthException.USER_NOT_FOUND
			);

		const isCorrect = await compare(password, obj.password);
		if (!isCorrect) throw new Exception(AuthException.INCORRECT_PASSWORD);

		delete obj.password;
		return obj;
	}

	generateToken(model: T) {
		const payload = {
			model: {
				email: model.email,
			},
		};
		return {
			auth: jwt.sign(payload, this.TOKEN_SECRET),
		};
	}

	validateToken(token: string) {
		const isValid = jwt.verify(token, this.TOKEN_SECRET);
		if (!isValid) throw new Exception(AuthException.INVALID_TOKEN);

		const { iat, model } = jwt.decode(token) as TokenPayload;
		const now = Date.now();
		if (now < iat - this.TOKEN_EXPIRY)
			throw new Exception(AuthException.TOKEN_EXPIRED);
		return model;
	}
}
