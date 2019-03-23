const routes = require('./apis');//our main functionailty file
module.exports = function(app, db) {
  routes(app, db);
  // Other route groups could go here, in the future
};
