const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

router.get('/', permissionMiddleware('dashboard.view'), dashboardController.getHomeData);

module.exports = router;