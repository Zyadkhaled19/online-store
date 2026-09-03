const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");

const { vaildtoken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.post("/products", vaildtoken, isAdmin, createProduct);
router.put("/products/:id", vaildtoken, isAdmin, updateProduct);
router.delete("/products/:id", vaildtoken, isAdmin, deleteProduct);

module.exports = router;
