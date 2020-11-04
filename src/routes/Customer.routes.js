const { Router } = require("express");
const { AuthMiddleware, StorageMiddleware } = require("../middlewares");

module.exports = function ({ CustomerController }) {
  const router = Router();
  router.get("", [AuthMiddleware], CustomerController.getAll);
  router.get("/:customerId", [AuthMiddleware], CustomerController.get);
  router.post(
    "/avatar/:customerId",
    [StorageMiddleware],
    CustomerController.saveAvatar,
  );
  router.patch("/:customerId", CustomerController.update);
  router.delete("/:customerId", [AuthMiddleware], CustomerController.delete);
  return router;
};
