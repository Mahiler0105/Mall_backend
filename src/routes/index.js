const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");

require("express-async-errors");

const { NotFoundMiddleware, ErrorMiddleware } = require("../middlewares");

module.exports = function ({
  AuthRoutes,
  BusinessRoutes,
  CalificationRoutes,
  CustomerRoutes,
  ProductRoutes,
}) {
  const router = express.Router();
  const apiRoutes = express.Router();

  //   MIDDLEWARES POR DEFECTO
  apiRoutes
    .use(express.json({ limit: "50mb" }))
    .use(bodyParser.urlencoded({ limit: "50mb" }))
    .use(cors())
    .use(helmet())
    .use(compression());

  // URL BASE ENDPOINTS
  apiRoutes.use("/auth", AuthRoutes);
  apiRoutes.use("/business", BusinessRoutes);
  apiRoutes.use("/calification", CalificationRoutes);
  apiRoutes.use("/customer", CustomerRoutes);
  apiRoutes.use("/product", ProductRoutes);

  // URL BASE
  router.use("/v1/api", apiRoutes);

  // ADD LOGIC MIDDLEWARE
  router.use(NotFoundMiddleware);
  router.use(ErrorMiddleware);

  return router;
};
