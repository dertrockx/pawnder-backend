import { User, Institution } from "@models";
import { AuthException, Exception } from "@constants";
import { compare } from "bcrypt";

export interface SessionToken {
	readonly auth: string;
	readonly refresh: string;
}

export interface TokenPayload {
	readonly model: User | Institution;
	readonly iat: number; // issued at
}

// BASE Class
abstract class BaseAuthHandler<T = undefined> {
	readonly TOKEN_SECRET: string = process.env.TOKEN_SECRET || "tokensecret";
	readonly TOKEN_EXPIRY: number = parseInt(process.env.TOKEN_EXPIRY) || 300; // 5 minutes

	abstract login(email: string, password: string): Promise<T>;

	abstract generateToken(model: T);
	abstract validateToken(token: string);
}

export class InstitutionAuthHandler extends BaseAuthHandler<Institution> {
	async login(email: string, password: string): Promise<Institution> {
		const institution = await Institution.createQueryBuilder("institution")
			.addSelect("institution.password")
			.where("institution.email = :email", { email })
			.getOne();
		if (!institution) throw new Exception(AuthException.INSTITUTION_NOT_FOUND);

		const isCorrect = compare(password, institution.password);
		if (!isCorrect) throw new Exception(AuthException.INCORRECT_PASSWORD);

		delete institution.password;
		return institution;
	}

	generateToken(model: Institution) {}
	validateToken(token: string) {}
}
