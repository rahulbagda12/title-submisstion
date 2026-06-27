// Vercel Serverless Function entry point
// This thin wrapper imports the Express app and exports it for Vercel's Node.js runtime.
const app = require("../backend/server");

module.exports = app;
