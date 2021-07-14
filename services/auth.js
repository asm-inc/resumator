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

Auth.authenticate = function *(request, httpReq) {
  if(!request || Object.keys(request).length === 0) {
    throw { status: 400, message: "Bad Request" }
  }

  if(httpReq.headers['content-type'] != 'application/x-www-form-urlencoded') {
   throw { status: 400, message: "Bad Request" } 
  }

  var email = request.username;
  var password = request.password;
  var client_id = request.client_id;
  var grant_type = request.grant_type;

  if(!email || !password || !client_id || !grant_type) {
    throw { status: 400, message: "Bad Request" } 
  }


  if(grant_type != 'password') {
    console.log('Bad grant_type');
    throw { status: 401, message: "Invalid grant_type" }
  }

  if(!validator.isEmail(email)) {
    console.log('bad email');
    throw { status: 401, message: "Invalid credentials" }
  }

  if(client_id != 'SoftwareDev') {
    console.log('Bad client_id');
    throw { status: 401, message: "Invalid credentials" }
  }

  // 
  if(!password || password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    console.log('Bad password length' + password.length);
    throw { status: 401, message: "Invalid credentials" }
  }
  // 8+ characters, uppercase, lowercase, and number required
  else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
    console.log('Bad password via regext');
    throw { status: 401, message: "Invalid credentials" }
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
  return { access_token: token, token_type: "bearer", expires_in: 899 };
};

Auth.getToken = function(email) {
  var buff = new Buffer(email);
  return buff.toString('base64');
}

module.exports = Auth;
