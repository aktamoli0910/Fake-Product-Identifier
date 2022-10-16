const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");

const productController = require("../../controllers/api/product");

router.post("/get", isAuthenticated, productController.get);
router.post("/getfake", isAuthenticated, productController.getFakeProducts);
router.post("/get/:productId", isAuthenticated, productController.getProduct);
router.post("/add", isAuthenticated, productController.add);
router.post("/edit", isAuthenticated, productController.edit);
router.post("/send", isAuthenticated, productController.send);

module.exports = router;
