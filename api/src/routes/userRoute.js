const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

router.post('/invite', permissionMiddleware('users.invite'), userController.invite);


module.exports = router;