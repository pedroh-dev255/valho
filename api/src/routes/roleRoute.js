const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

router.get('/', permissionMiddleware('roles.view'), roleController.getRoles);
router.post('/', permissionMiddleware('roles.add'), roleController.addRole);

module.exports = router;