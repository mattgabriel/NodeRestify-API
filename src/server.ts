"use strict";

import * as conf from "./config/config";
import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import * as corsMiddleware from "restify-cors-middleware";
import * as serveStatic from "serve-static-restify";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();
console.log(process.env.POSTGRESQL_HOST);
console.log(process.env.ENV);


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
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
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
	/\/*/,
	restify.plugins.serveStatic({
		directory: __dirname + "/public",
		default: "index.html"
	})
);


/**
 * Start server
 */
server.listen(conf.config.port, function() {
	console.log(`Server is listening on port ${conf.config.port}`);
});
