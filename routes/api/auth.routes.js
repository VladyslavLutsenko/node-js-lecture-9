const express = require('express');
const {controllerWrapper} = require('../../helpers');
const {createValidator} = require('express-joi-validation');
const {authController} = require('../../controllers')
const {authSchema} = require('../../schemas');
const { authorizeMiddleware } = require('../../middlewares');

const router = express.Router();
const validator = createValidator();

router.post('/register', validator.body(authSchema.registerSchema), controllerWrapper(authController.register));

router.post('/login', validator.body(authSchema.loginSchema), controllerWrapper(authController.login));

router.post('/logout', authorizeMiddleware, controllerWrapper(authController.logout));

module.exports = router;
