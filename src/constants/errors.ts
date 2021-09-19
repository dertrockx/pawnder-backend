export enum AuthException {
	USER_NOT_FOUND = "USER_NOT_FOUND",
	INVALID_FIELDS = "INVALID_FIELDS",
	INSTITUTION_NOT_FOUND = "INSTITUTION_NOT_FOUND",
	INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
	INCORRECT_EMAIL_PASSWORD = "INCORRECT_EMAIL_PASSWORD",
	INVALID_TOKEN = "INVALID_TOKEN",
	TOKEN_EXPIRED = "TOKEN_EXPIRED",
	ACCESS_DENIED = "ACCESS_DENIED",
}

export enum ModelException {
	USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
	INSTITUTION_ALREADY_EXISTS = "INSTITUTION_ALREADY_EXISTS",
}

export type ExceptionType = AuthException | ModelException;

export class Exception<T = undefined> {
	constructor(
		public readonly code: ExceptionType,
		public readonly message?: string,
		public readonly data?: T
	) {}
}
