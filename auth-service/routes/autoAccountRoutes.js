const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authenticate');
const autoAccountController  = require('../controllers/autoAccountController');

// Protected routes

// Route to create a new AutoAccount
router.post('/createautoaccounts', verifyToken, autoAccountController.createAutoAccount);

// Route to get all AutoAccounts for the authenticated user
router.get('/listautoaccounts', verifyToken, autoAccountController.getAutoAccounts);


module.exports = router;