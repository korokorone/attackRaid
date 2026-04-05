const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;
const connection = postgres(connectionString);

module.exports = connection;