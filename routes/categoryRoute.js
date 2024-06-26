const express = require('express');
const categoryRoute = express();
const categoryControleFile = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const helper = require('../utils/helper');
categoryRoute.use(express.json());

categoryRoute.post('/category/add-category', auth, helper.uploadImage.single("image"), categoryControleFile.addCategories);

categoryRoute.get('/category/find-category', categoryControleFile.findCategories);

categoryRoute.post('/category/delete-category', auth, categoryControleFile.deleteCategories);

categoryRoute.post('/category/update-category', auth, categoryControleFile.updateCategories);

module.exports = categoryRoute;