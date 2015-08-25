var fs    = require("fs"),
    files = fs.readdirSync("./controllers");

function getRoutes() {
  var arrays = files.map(function(f) {
    return require("./controllers/" + f).routes();
  });

  return [].concat.apply([], arrays);
}

function routeFn(app, route) {
  return {
    auth: function() {
      return getRoutes().filter(function(r) { return r.auth; });
    },
    open: function() {
      return getRoutes().filter(function(r) { return !r.auth; });
    },
    setup: function(r) {
      app.use(route[r.method](r.url, r.fn));
    }
  };
}

module.exports = routeFn;
