const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../config");
const fs = require('fs');

const PRIVATE_KEY = fs.readFileSync("./src/lib/keys/lerietmall.key");

function _err(msg, code = 500) {
     const err = new Error();
     err.code = code;
     err.message = msg;
     throw err;
}

module.exports = function (req, res, next) {
     var { id } = req.body;
     var token = req.headers.authorization;

     if (!token) _err("Token must be sent", 400);

     if (!token.includes("Bearer")) _err("Invalid Token", 401);

     const [, key] = token.split(" ");
     token = key;

     //  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
     //       if (err) {
     //            const error = new Error();
     //            error.message = "Invalid Token";
     //            error.status = 401;
     //            throw error;
     //       }
     //       req.user = decodedToken.user;
     //       next();
     //  });
     jwt.verify(token, PRIVATE_KEY, { algorithms: ["RS256"] }, (err, decodedToken) => {
          if (err) _err("Invalid Token", 401);
          if (id && decodedToken.user.id != id) _err("Not authorized", 401);
          req.user = decodedToken.user;
          next();
     });
};
