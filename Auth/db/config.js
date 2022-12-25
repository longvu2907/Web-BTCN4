const initOptions = {};
const pgp = require("pg-promise")(initOptions);
const config = require("../configs/cnStr");

const db = pgp(config);

module.exports = db;
