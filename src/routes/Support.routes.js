const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ SupportController }) {
     const router = Router();
     router.post("/request", [AuthMiddleware], SupportController.createRequest); // 😁
     router.post("/list", [AuthMiddleware], SupportController.listRequest); // 😁
     router.post("/search", [AuthMiddleware], SupportController.searchRequest); // 😁
     return router;
};
