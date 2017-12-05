import * as dotenv from "dotenv";
dotenv.config();

// list of valid environments
const environments = ["development", "production"];

// make sure config.env is in the list above (just in case the user makes a mistake)
let env = process.env.API_ENV || environments[0];
if (environments.indexOf(env) === -1) {
	env = environments[0];
}


export const config = {
	name: process.env.API_NAME || "API",
	version: process.env.API_VERSION || "3.0.0",
	authSecret: process.env.API_AUTH_SECRET || "mySecretAuthKey",
	refreshTokenLifespan: 31536000, // in seconds
	accessTokenLifespan: 3600, // in seconds
	env: env,
	port: process.env.API_PORT || 3000,
	base_url: process.env.BASE_URL || "http://localhost",
	postgresql: {
		user: process.env.API_PG_USER || "",
		pass: process.env.API_PG_PASS || "",
		host: process.env.API_PG_HOST || "",
		port: process.env.API_PG_PORT || 5432,
		db: process.env.API_PG_DB || "",
	},
	redis: {
		host: process.env.API_REDIS_HOST || "",
		port: process.env.API_REDIS_PORT || ""
	},
	basePath: (path: String) => {
		return "/" + path.replace(/^\//, "");
	}
};