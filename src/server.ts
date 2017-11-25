"use strict";

import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import * as corsMiddleware from "restify-cors-middleware";
import * as serveStatic from "serve-static-restify";
import * as fs from "fs";
import * as conf from "./config/config";
const jwt = require("restify-jwt");


console.log("┌-----------------------------------");
console.log(`| Env: ${process.env.API_ENV}`);
console.log(`| URL: ${conf.config.base_url}:${conf.config.port}`);

const cors = corsMiddleware({
	preflightMaxAge: 5, // optional
	origins: ["*"], // ["http://*.xx.com", "https://*.xx.com"],
	allowHeaders: ["*"], // ["API-Token"],
	exposeHeaders: ["*"], // ["API-Token-Expiry"]
});


const server = restify.createServer({
	name: conf.config.name,
	version: conf.config.version
});

/**
 * Middleware
 */
// server.pre(restify.pre.sanitizePath());
server.pre(cors.preflight);
server.use(cors.actual);
// server.use(jwt({
// 	secret: conf.config.authSecret,
// 	credentialsRequired: false
// }).unless({
// 	path: [
// 		conf.config.basePath("/ping")
// 	]
// }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

fs.readdirSync(__dirname + "/routes").forEach(function (routeConfig: string) {
	if (routeConfig.substr(-3) === ".js") {
		const route = require(__dirname + "/routes/" + routeConfig);
		route.routes(server);
	}
});

/**
 * Serve static page (ie. docs)
 */
server.get(
	/^\/?.*/,
	restify.plugins.serveStatic({
		directory: __dirname + "/public",
		default: "index.html"
	})
);


/**
 * Start server
 */
server.listen(conf.config.port, function() {
	console.log(`| Server is listening on port ${conf.config.port}`);
	console.log("└-----------------------------------");
});
