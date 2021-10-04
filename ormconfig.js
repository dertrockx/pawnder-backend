let config = {
	type: "mysql",
	synchronize: true,
	logging: false,
};

const env = process.env.NODE_ENV || "development";
if (env === "production")
	Object.assign(config, { url: process.env.MYSQL_CONNECT_URL });
else
	Object.assign(config, {
		host: process.env.MYSQL_HOST || "localhost",
		username: process.env.MYSQL_USERNAME || "pawnder",
		password: process.env.MYSQL_PASSWORD || "pawnder",
		database: process.env.MYSQL_DATABASE || "pawnder",
		port: parseInt(process.env.MYSQL_PORT) || 3306,
	});

module.exports = {
	...config,
	entities: ["src/models/**/*.ts"],
	migrations: ["src/migration/**/*.ts"],
	subscribers: ["src/subscriber/**/*.ts"],
	cli: {
		entitiesDir: "src/models",
		migrationsDir: "src/migration",
		subscribersDir: "src/subscriber",
	},
};
