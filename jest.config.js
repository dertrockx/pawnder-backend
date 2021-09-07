module.exports = {
	roots: ["./src"],
	transform: {
		"\\.ts$": "ts-jest",
	},
	testRegex: "\\.spec\\.ts$",
	moduleFileExtensions: ["ts", "json", "js"],
	moduleNameMapper: {
		"@models": "<rootDir>/src/models",
		"@decorators": "<rootDir>/src/decorators",
		"@utils": "<rootDir>/src/utils",
		"@handlers": "<rootDir>/src/handlers",
		"@constants": "<rootDir>/src/constants",
	},
	setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
};
