const path = require('path');

const express = require('express');

const router = express.Router(); 

const loginController = require('../controllers/login');

router.get('/', loginController.getIndex);

router.get('/getUser', loginController.getUser);

router.get('/allUsers', loginController.getAllUsers);

router.post('/addUser', loginController.postAddUser);

module.exports = router;