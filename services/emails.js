var config   = require("../config"),
    sendgrid = require("sendgrid")(config.sendgrid.password);

var Emails = {};

Emails.send = function(to, from, subject, text, html) {
  var params = {
    to,
    from,
    subject,
    text,
    html
  };

  return new Promise(function(resolve, reject) {
    sendgrid.send(params, function(error, json) {
      if(error) {
        reject(error);
      } else {
        resolve(json);
      }
    });
  });
};

module.exports = Emails;
