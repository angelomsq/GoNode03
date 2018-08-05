const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('../app/models');

module.exports = {
  secret: 'docfy2018rocketseat',
  resave: false,
  saveUninitialize: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
