var fs  = require("fs"),
    dot = require("dot");

var Files = {}

Files.fetch = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, "utf8", function (error, data) {
      if(error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

Files.merge = function(file, data) {
  var template = dot.template(file);
  return template(data);
};

module.exports = Files;
