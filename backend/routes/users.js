var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/authJWT')

/* GET users listing. */
router.post('/login', userController.login);
router.get('/login', verifyToken,userController.checklogin);

module.exports = router;
