const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

router.get('/', permissionMiddleware('roles.view'), roleController.getRoles);

module.exports = router;