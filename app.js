var config         = require("./config"),
    app            = require("koa")(),
    bodyParser     = require("koa-bodyparser"),
    overrideMethod = require("koa-override-method"),
    logger         = require("koa-logger"),
    route          = require("koa-route"),
    routes         = require("./routes")(app, route);

app.use(logger());
app.use(bodyParser());
app.use(function *(next) {
  this.request.method = overrideMethod.call(this, this.request.body);
  yield next;
});

app.use(function *(next) {
  try {
    yield next;
  } catch(error) {
    console.log(error);
    this.status = error.status || 500;
    this.body = error;
  }
});

// Unauthenticated routes
routes.open().map(routes.setup);

app.listen(config.app.port);
console.log("listening on port %d", config.app.port);
