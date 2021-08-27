import { createConnection } from "typeorm";
import * as Entities from "@models";

export const connection = () =>
	createConnection({
		type: "mysql",
		host: "localhost",
		port: 3306,
		synchronize: true,
		logging: false,
		dropSchema: false,

		// TODO: Store db creds in a separate file e.g. a '.env' file
		username: "pawnder",
		password: "pawnder",
		database: "pawnder",

		entities: [...Object.values(Entities)],
	});
