import { ValueTransformer } from "typeorm";

export const transformHashedValue: ValueTransformer = {
	to: (password: string): string => password,
	from: (hash) => hash,
};
