module.exports = {
  username: process.env.DB_PASSWORD,
  password: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    maxConnections: 5,
    maxIdleTime: 30,
  },
};
