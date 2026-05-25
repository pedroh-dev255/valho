const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const userController = require('../controllers/userController');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

router.get('/', permissionMiddleware('config.view'), configController.getConfigData);
router.get('/users', permissionMiddleware('users.view'), userController.getUsers);
router.post('/users/invite', permissionMiddleware('users.invite'), userController.invite);
router.get('/users/invite', permissionMiddleware('users.invite'), userController.getInvites);
router.delete('/users/invite/:inviteId', permissionMiddleware('users.invite'), userController.deleteInvite);

module.exports = router;