const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const config = require("../configs/connectStr");

const db = pgp(config);

module.exports = db;
