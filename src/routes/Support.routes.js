const { Router } = require("express");
const { AuthMiddleware, FileMiddleware } = require("../middlewares");

module.exports = function ({ SupportController }) {
     const router = Router();
     router.post("/request", [AuthMiddleware], SupportController.createRequest); // 😁
     router.post("/list", [AuthMiddleware], SupportController.listRequest); // 😁
     router.post("/search", [AuthMiddleware], SupportController.searchRequest); // 😁
     router.post("/file/:id", [AuthMiddleware, FileMiddleware], SupportController.uploadFile); // 😁
     router.post("/cancel", [AuthMiddleware], SupportController.cancelRequest); // 😁
     return router;
};
