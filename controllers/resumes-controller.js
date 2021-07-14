var Resumes = require("../services/resumes");
var Auth = require("../services/auth");

var ResumesController = {
  routes() {
    return [
      { method: "get", url: "/", fn: this.ping, auth: false },
      { method: "post", url: "/resumes", fn: this.create, auth: false },
      { method: "post", url: "/api/tokens", fn: this.auth, auth: false }
    ];
  },
  create: function *() {
    this.set("Content-Type", "application/json");
    this.body = yield Resumes.create(this.request.body, this.request);
  },
  auth: function *() {
    console.log(this.request.body);
    this.set("Content-Type", "application/json");
    this.body = yield Auth.authenticate(this.request.body, this.request);
  },
  ping: function *() {
    this.body = { status : "alive" };
  }
};

module.exports = ResumesController;
