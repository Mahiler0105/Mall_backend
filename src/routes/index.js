const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");

require("express-async-errors");

const swaggerUI = require("swagger-ui-express");
const { NotFoundMiddleware, ErrorMiddleware } = require("../middlewares");
const { SWAGGER_PATH } = require("../config");

const swaggerDocument = require(SWAGGER_PATH);

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
  router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  // ADD LOGIC MIDDLEWARE
  router.use(NotFoundMiddleware);
  router.use(ErrorMiddleware);

  return router;
};
