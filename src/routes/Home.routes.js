const { Router } = require("express");

module.exports = function ({ HomeController }) {
  const router = Router();
  router.get("", HomeController.getHome); // 😁
  return router;
};
