const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { vaildtoken } = require("../middleware/authMiddleware");

router.use(vaildtoken);
router.post("/", orderController.createOrder);

router.get("/", orderController.getUserOrders);

module.exports = router;
