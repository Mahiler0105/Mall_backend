const { Router } = require("express");

module.exports = function ({ CalificationController }) {
  const router = Router();
  router.get("", CalificationController.getAll);
  router.get("/:calificationId", CalificationController.get);
  router.patch("/:calificationId", CalificationController.update);
  router.delete("/:calificationId", CalificationController.delete);
  return router;
};
