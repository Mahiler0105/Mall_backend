const { Router } = require("express");
const { StorageMiddleware } = require("../middlewares");

module.exports = function ({ ProductController }) {
  const router = Router();
  router.get("", ProductController.getAll);
  router.get("/:productId", ProductController.get);
  router.post("/images/:productId", [StorageMiddleware], ProductController.saveImage);
  router.post("", ProductController.create);
  router.patch("/:productId", ProductController.update);
  router.delete("/:productId", ProductController.delete);
  return router;
};
