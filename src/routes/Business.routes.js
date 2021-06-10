const { Router } = require("express");
const { AuthMiddleware, StorageMiddleware } = require("../middlewares");

module.exports = function ({ BusinessController }) {
     const router = Router();
     router.get("", BusinessController.getAll); // 😁
     router.get("/:businessId", BusinessController.get); // 😁
     router.get("/validate/:businessId", [AuthMiddleware], BusinessController.validate); // 😁
     router.get("/category/:categoryName", BusinessController.getCategory); // 😁
     router.get("/storage/:businessId",[AuthMiddleware], BusinessController.getStorage); // 😁
     router.get("/lines/:businessId",[AuthMiddleware], BusinessController.getLines); // 😁
     router.post("/lines/update",[AuthMiddleware], BusinessController.changeLine); // 😁
     router.post("/logo/:businessId", [StorageMiddleware], BusinessController.saveLogo); // 😁
     router.post("/images/:businessId", [StorageMiddleware], BusinessController.saveImages); // 😁
     router.patch("/:businessId", [AuthMiddleware], BusinessController.update); // 😁
     router.delete("/:businessId", [AuthMiddleware], BusinessController.delete); // 😁
     return router;
};
