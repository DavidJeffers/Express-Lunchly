"use strict";

/** Database for lunchly */

const { Client } = require("pg");

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql://davidjeffers:1234@localhost:5432/lunchly_test"
    : "postgresql://davidjeffers:1234@localhost:5432/lunchly";

let db = new Client({
  connectionString: DB_URI,
});

db.connect();

module.exports = db;
