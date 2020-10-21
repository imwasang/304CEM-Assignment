var express = require('express');
var router = express.Router();
const controller = require('../controller/userController')


router.post('/login', controller.login)
router.post('/register', controller.register)
router.get('/validate', controller.validate)
router.get('/logout', controller.logout)

module.exports = router;
