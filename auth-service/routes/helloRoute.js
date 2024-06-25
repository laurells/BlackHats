const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authenticate');
const helloController = require('../controllers/helloController')

// Protected route example
router.get('/helloworld', verifyToken, helloController.sayHello);

module.exports = router;
