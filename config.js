require("dotenv").load();

var config = {};

config.app = {};
config.app.port = process.env.PORT || 3000;
config.app.fromAddress = process.env.FROM_ADDRESS || "resumator@mail.asm-cloud.com";
config.app.toAddress = process.env.TO_ADDRESS || "asm.hr.dev@mdstaff.com";

config.sendgrid = {};
config.sendgrid.username = process.env.SENDGRID_USERNAME || "mdstaff";
config.sendgrid.password = process.env.SENDGRID_PASSWORD;

module.exports = config;
