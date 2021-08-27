import { App } from "./app";
import { connection } from "./config/database";

connection()
	.then(() => {
		console.log(`> Successfully connected to database`);
		const server = new App();

		server.start();
	})
	.catch(({ code, sqlMessage }) => {
		console.log(`Failer to connect to database: ${sqlMessage} {${code}}`);
	});
