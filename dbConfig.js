require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  user: 'ebuielxsozitxz',
  host: 'ec2-54-73-68-39.eu-west-1.compute.amazonaws.com',
  database: 'd7ntvp15kaa1jh',
  password: '9898537180f929ba268da6b643a060295123cf0e20edc556840f8d31695995e7',
  port: 5432,
});

client.connect();

module.exports = { client };
