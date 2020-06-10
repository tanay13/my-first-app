const { toLambda } = require("probot-serverless-now");
const app = require("../index");
module.exports = toLambda(app);