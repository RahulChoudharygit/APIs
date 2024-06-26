const express = require('express');
const userRoute = express();
const userControllerFile = require('../controllers/userController.js');
const auth = require('../middlewares/auth.js');
const helper = require('../utils/helper');

userRoute.use(express.json());

userRoute.post('/user/login', userControllerFile.userlogin);

userRoute.post('/user/registration', helper.uploadImage.single("image"), userControllerFile.userRegistration);

userRoute.get('/user/getAllUsers', auth, userControllerFile.findUsers);

userRoute.post('/user/update-user', auth, helper.uploadImage.single("image"), userControllerFile.updateUser);

userRoute.post('/user/delete-user', auth, userControllerFile.deleteUser);

module.exports = userRoute;