require('dotenv').config();
const { Client } = require('pg')
const client = new Client({
  user: 'adam',
  host: 'localhost',
  database: 'koalabestbet',
  password: 'adam',
  port: 5432,
}, { multipleStatements: true})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = client;