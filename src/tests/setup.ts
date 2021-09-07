import { Connection } from "typeorm";
import { connection as intializeDatabase } from "../config/database";

let connection: Connection;

beforeAll(async () => {
	connection = await intializeDatabase();
});

afterAll(async () => {
	await connection.close();
});
