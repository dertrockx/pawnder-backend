import { createConnection } from "typeorm";
import * as Entities from "@models";
import * as dotenv from "dotenv";

dotenv.config();

export const connection = () =>
	createConnection({
		type: "mysql",
		host: "localhost",
		port: 3306,
		synchronize: true,
		logging: false,
		dropSchema: false,

		// TODO: Store db creds in a separate file e.g. a '.env' file
		username: process.env.MYSQL_USERNAME || "pawnder",
		password: process.env.MYSQL_PASSWORD || "pawnder",
		database: process.env.MYSQL_DATABASE || "pawnder",

		entities: [...Object.values(Entities)],
	});
