import { config } from "../config/config";

import * as Promise from "bluebird";
import * as pg from "pg";
import * as client from "knex";

export const knex: client = client({
	client: "pg",
	connection: {
		host: config.postgresql.host,
		ssl: true,
		user: config.postgresql.user,
		password: config.postgresql.pass,
		database: config.postgresql.db
	},
	pool: {
		min: 2,
		max: 20
	},
	debug: true,
});


export const TABLES = {
	AuthTokens: "AuthTokens",
	UserTokens: "UserTokens",
	Users: "Users",
	UserRoles: "UserRoles"
};