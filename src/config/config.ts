export const config = {
	name: "API",
	version: "3.0.0",
	env: process.env.NODE_ENV || "development",
	port: process.env.PORT || 3000,
	base_url: process.env.BASE_URL || "http://localhost:3000",
};
