import { ValueTransformer } from "typeorm";
import { hashSync } from "bcrypt";

export const SALT_ROUNDS = 10;

export const transformHashedValue: ValueTransformer = {
	to: (password: string): string => hashSync(password, SALT_ROUNDS),
	from: (hash) => hash,
};
