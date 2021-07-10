const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");

module.exports = function ({ StripeRoutes, AdminController }) {
     const admin = express.Router();

     admin.use(express.json({ limit: "50mb" }))
          .use(bodyParser.urlencoded({ limit: "50mb" }))
          .use(cors())
          .use(helmet())
          .use(compression());
          
     admin.post("/key", AdminController.key);
     admin.use("/stripe", StripeRoutes);
     // admin.use("/business", BusinessRoutes);
     // admin.use("/customer", CustomerRoutes);
     // admin.use("/products", CustomerRoutes);
     // admin.use("/orders", CustomerRoutes);
     // admin.use("/memberships", CustomerRoutes);

     return admin;
};
