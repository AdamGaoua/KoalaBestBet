require('dotenv').config();
const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: '178.62.31.89',
  database: 'koalabestbettt',
  password: 'js4test',
  port: 5432,
}, { multipleStatements: true})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = client;