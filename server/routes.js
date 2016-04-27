module.exports = function(app) {
  app.use('/auth', require('./auth'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/stages', require('./api/stage'));
  app.use('/api/run', require('./api/run'));
};