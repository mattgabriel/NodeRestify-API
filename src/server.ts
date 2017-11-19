"use strict";

import * as conf from "./config/config";
import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import * as corsMiddleware from "restify-cors-middleware";
import * as serveStatic from "serve-static-restify";
import * as dotenv from "dotenv";

dotenv.config();
console.log(process.env.POSTGRESQL_HOST);
console.log(process.env.SOME_TEST);


const cors = corsMiddleware({
	preflightMaxAge: 5, // optional
	origins: ["*"], // ['http://*.tracktics.com', 'https://*.tracktics.com'],
	allowHeaders: ["*"], // ['API-Token'],
	exposeHeaders: ["*"], // ['API-Token-Expiry']
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

/**
 * Serve static page (ie. docs)
 */
server.get(
	/\/(.*)?.*/,
	restify.plugins.serveStatic({
		directory: __dirname + "/public",
		default: "index.html"
	})
);

/**
 * Block comment
 */


/**
 * Start server
 */
server.listen(conf.config.port, () => {
	// require('./routes')(server);
	console.log(`Server is listening on port ${conf.config.port}`);
});
