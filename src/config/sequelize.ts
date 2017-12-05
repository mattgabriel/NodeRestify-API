import { config } from "../config/config";
import { Sequelize, Table, Column, Model, HasMany } from "sequelize-typescript";


export const sequelize =  new Sequelize({
	database: config.postgresql.db,
	dialect: "postgres",
	username: config.postgresql.user,
	password: config.postgresql.pass,
	host: config.postgresql.host,
	port: config.postgresql.port as number,
	modelPaths: [__dirname + "/../db"],
	dialectOptions: {
		ssl: true
	}
});