var config    = require("../config"),
    validator = require("validator"),
    emails    = require("./emails"),
    files     = require("./files"),
    Auth      = require("./auth");

var MAX_RESUME_LENGTH = 777;
var MAX_NAME_LENGTH = 30;

var Resumes = {};

var Emails = {
  resume: {
    text: "./emails/resume.txt",
    html: "./emails/resume.html"
  }
};

Resumes.create = function *(request, httpReq) {
  if(!request || Object.keys(request).length === 0) {
    throw { status: 422, message: "Request must be in the form of { name, email, phoneNumber, resume }" }
  }

  if(!httpReq || !httpReq.headers) {
    throw { status: 401, message: "You are not authorized to access this resource. Please authenticate and try again." }
  }

  var email = request.email;
  var auth = httpReq.headers["authorization"];
  if(!auth || !email) {
    throw { status: 401, message: "You are not authorized to access this resource. Please authenticate and try again." }
  }

  var expectedToken = Auth.getToken(email);
  if(auth != "Bearer " + expectedToken) {
    throw { status: 401, message: "Invalid token. Please authenticate and try again." }
  }

  var name = request.name;
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

  var responseData = {
    name: name.toString(),
    email: email.toString(),
    phoneNumber: phoneNumber.toString(),
    resume: resume.toString()
  }

  // Send email
  var result = yield emails.send(config.app.toAddress.split(';'), config.app.fromAddress, `New resume from ${name}`, text, html);
  console.log(result);
  return { message: "Thanks for sending us your resume, " + request.name + ". We will get back to you shortly.", request: responseData }
};

module.exports = Resumes;
