const path = require('path');

module.exports = {
  url: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${
    process.env.DB_PORT
  }/${process.env.DB_DATABASE}?authSource=admin`,
  modelsPath: path.resolve('app', 'models'),
};
