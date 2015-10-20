var config    = require("../config"),
    validator = require("validator"),
    emails    = require("./emails"),
    files     = require("./files");

var MAX_RESUME_LENGTH = 777;
var MAX_NAME_LENGTH = 30;

var Resumes = {};

var Emails = {
  resume: {
    text: "./emails/resume.txt",
    html: "./emails/resume.html"
  }
};

Resumes.create = function *(request) {
  if(!request || Object.keys(request).length === 0) {
    throw { status: 422, message: "Request must be in the form of { name, email, phoneNumber, resume }" }
  }

  var name = request.name;
  var email = request.email;
  var phoneNumber = request.phoneNumber;
  var resume = request.resume;

  if(!name) {
    throw { status: 422, message: "name is required", request }
  }

  if(!validator.isEmail(email)) {
    throw { status: 422, message: "A valid email is required", request }
  }

  if(!validator.isMobilePhone(phoneNumber, "en-US")) {
    throw { status: 422, message: "A valid phoneNumber is required", request }
  }

  if(!resume || resume.length > MAX_RESUME_LENGTH) {
    throw { status: 422, message: "resume is required", request }
  }

  var data = {
    name,
    email,
    phoneNumber,
    resume
  };

  // Send email
  var textTemplate = yield files.fetch(Emails.resume.text);
  var htmlTemplate = yield files.fetch(Emails.resume.html);
  var text = files.merge(textTemplate, data);
  var html = files.merge(htmlTemplate, data);

  // Send email
  var result = yield emails.send(config.app.toAddress, config.app.fromAddress, `New resume from ${name}`, text, html);
  console.log(result);
  return { message: "Thanks for sending us your resume, " + request.name + ". We will get back to you shortly.", request: data }
};

module.exports = Resumes;
