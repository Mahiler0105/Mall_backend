const jwt = require("jsonwebtoken");
// const { ADMIN_SECRET } = require("../config");

const fs = require('fs');
const ADMIN_SECRET = fs.readFileSync("./src/lib/keys/admin.key");

function _err(msg, code = 500) {
     const err = new Error();
     err.code = code;
     err.message = msg;
     throw err;
}

module.exports = function (req, res, next) {
     var token = req.headers.authorization;

     if (!token) _err("Token must be sent", 400);

     if (!token.includes("Bearer")) _err("Invalid Token", 401);

     const [, key] = token.split(" ");
     token = key;

     jwt.verify(token, ADMIN_SECRET, { algorithms: ["RS256"] }, (err, decodedToken) => {
          if (err) _err("Invalid Token", 401);
          next();
     });
};
