module.exports = {
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: process.env.MYSQL_USERNAME || "pawnder",
	password: process.env.MYSQL_PASSWORD || "pawnder",
	database: process.env.MYSQL_DATABASE || "pawnder",
	synchronize: true,
	logging: false,
	entities: ["src/models/**/*.ts"],
	migrations: ["src/migration/**/*.ts"],
	subscribers: ["src/subscriber/**/*.ts"],
	cli: {
		entitiesDir: "src/models",
		migrationsDir: "src/migration",
		subscribersDir: "src/subscriber",
	},
};
