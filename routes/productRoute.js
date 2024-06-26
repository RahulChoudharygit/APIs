const express = require("express");
const productRoute = express();
productRoute.use(express.json());
const productControleFile = require('../controllers/productController');
const { uploadImage } = require('../utils/helper');
const auth = require("../middlewares/auth");

productRoute.post('/products/add-products', auth, uploadImage.single('image'), productControleFile.addProducts);

productRoute.get('/products/find-Products', productControleFile.getProduct);

productRoute.post('/products/delete-Products', auth, productControleFile.deleteProduct);

productRoute.post('/products/update-Products', auth, uploadImage.single('book_image'), productControleFile.updateProduct);

module.exports = productRoute;