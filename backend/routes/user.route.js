const express = require("express");
const {
  findUserByEmail,
  changeUserRole,
} = require("../controller/user.controller");
const { vaildtoken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(vaildtoken, isAdmin);
router.get("/users", findUserByEmail);
router.patch("/users/:id/role", changeUserRole);

module.exports = router;
