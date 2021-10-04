import { createConnection } from "typeorm";
import { ConnectionOptions } from "typeorm";
import * as Entities from "@models";
import * as dotenv from "dotenv";

dotenv.config();

let config: ConnectionOptions = {
	type: "mysql",
	host: process.env.MYSQL_HOST || "localhost",
	port: parseInt(process.env.MYSQL_PORT) || 3306,
	synchronize: true,
	logging: false,
	dropSchema: false,

	username: process.env.MYSQL_USERNAME || "pawnder",
	password: process.env.MYSQL_PASSWORD || "pawnder",
	database: process.env.MYSQL_DATABASE || "pawnder",
	entities: [...Object.values(Entities)],
};

const env = process.env.NODE_ENV || "development";
if (env === "production")
	Object.assign(config, { type: "mysql", url: process.env.MYSQL_CONNECT_URL });
export const connection = () => createConnection(config);
