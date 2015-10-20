var Resumes = require("../services/resumes");

var ResumesController = {
  routes() {
    return [
      { method: "get", url: "/", fn: this.ping, auth: false },
      { method: "post", url: "/resumes", fn: this.create, auth: false }
    ];
  },
  create: function *() {
    this.set("Content-Type", "application/json");
    this.body = yield Resumes.create(this.request.body);
  },
  ping: function *() {
    this.body = { status : "alive" };
  }
};

module.exports = ResumesController;
