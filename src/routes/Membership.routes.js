const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ MembershipController }) {
     const router = Router();
     router.post("/refreshkeys", MembershipController.refreshKeys); // 😁
     router.post("/cancel", [AuthMiddleware], MembershipController.cancelMembership); // 😁
     router.post("/continue", [AuthMiddleware], MembershipController.continueMembership); // 😁
     return router;
};
