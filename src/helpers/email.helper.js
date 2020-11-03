const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const { USER_EMAIL, PASS_EMAIL } = require("../config");
console.log(USER_EMAIL, PASS_EMAIL);

// confirm,
// reset
module.exports.sendEmail = function (email, subject, kind, context) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: PASS_EMAIL,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, "views"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));

  let mail_options = {
    from: "fernando.mahiler@gmail.com",
    to: email,
    subject: subject,
    template: kind,
    context: context,
  };
  return new Promise(async (r, e) => {
    await transporter.sendMail(mail_options, (error, info) => {
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
