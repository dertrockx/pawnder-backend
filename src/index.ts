import { App } from "./app";
import { connection } from "./config/database";
import * as dotenv from "dotenv";

dotenv.config();

connection()
	.then(() => {
		console.log(`> Successfully connected to database`);
		const server = new App();

		server.start();
	})
	.catch((err) => {
		console.log(`Failed to connect to database`);
		console.log(err);
	});
