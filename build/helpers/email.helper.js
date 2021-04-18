"use strict";

const nodemailer = require("nodemailer");

const path = require("path");

const hbs = require("nodemailer-express-handlebars");

const {
  USER_EMAIL,
  PASS_EMAIL
} = require("../config");

module.exports = function sendEmail(email, subject, kind, context) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: PASS_EMAIL
    }
  });
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, "views"),
      defaultLayout: false
    },
    viewPath: path.resolve(__dirname, "views"),
    extName: ".handlebars"
  };
  transporter.use("compile", hbs(handlebarOptions));
  const mailOptions = {
    from: "fernando.mahiler@gmail.com",
    to: email,
    subject,
    template: kind,
    context
  };
  return new Promise(r => {
    transporter.sendMail(mailOptions, error => {
      if (error) {
        console.log(error);
        r(false);
      } else {
        console.log("Mensaje enviado con exito");
        r(true);
      }
    });
  });
};