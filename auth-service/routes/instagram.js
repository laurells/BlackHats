const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

router.post('/auto-accounts/:id/start', instagramController.startInstaBot);

router.post('/auto-accounts/:id/stop', instagramController.stopInstaBot);

module.exports = router;