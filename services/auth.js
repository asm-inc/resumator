var config    = require("../config"),
    validator = require("validator"),
    emails    = require("./emails"),
    files     = require("./files");

var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 18;

var Auth = {};

// var Emails = {
//   resume: {
//     text: "./emails/resume.txt",
//     html: "./emails/resume.html"
//   }
// };

Auth.authenticate = function *(request) {
  if(!request || Object.keys(request).length === 0) {
    throw { status: 422, message: "Request must be in the form of { email, password }" }
  }

  var email = request.email;
  var password = request.password;

  if(!validator.isEmail(email)) {
    throw { status: 422, message: "Email is required" }
  }

  // 
  if(!password || password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    throw { status: 422, message: "invalid password" }
  }
  // 8+ characters, uppercase, lowercase, and number required
  else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
   throw { status: 422, message: "invalid password" } 
  }

  var token = Auth.getToken(email);

  // Send email
  // var textTemplate = yield files.fetch(Emails.resume.text);
  // var htmlTemplate = yield files.fetch(Emails.resume.html);
  // var text = files.merge(textTemplate, data);
  // var html = files.merge(htmlTemplate, data);

  // Send email
  // var result = yield emails.send(config.app.toAddress.split(';'), config.app.fromAddress, `New resume from ${name}`, text, html);
  console.log(token);
  return { token: token }
};

Auth.getToken = function(email) {
  var buff = new Buffer(email);
  return buff.toString('base64');
}

module.exports = Auth;
