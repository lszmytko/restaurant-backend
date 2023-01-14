require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  user: "lszmytko",
  host: "localhost",
  database: "sklepusers",
  password: "3Edc4rfv",
  port: 5432,
});

client
  .connect()
  .then(() => console.log("connected"))
  .catch((err) => console.error("connection error", err.stack));

module.exports = { client };
