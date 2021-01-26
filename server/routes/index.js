const express = require('express');
const router = express.Router();
const navigationController = require('../controller/navigationController')

router.get('/navigation', navigationController.navigateWithoutTime);
router.get('/navigationWithTime', navigationController.navigateWithTime);
router.get('/stations', navigationController.getStations);

module.exports = router;