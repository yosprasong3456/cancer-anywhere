const express = require('express');
const router = express.Router();
const registedController = require('../controllers/registedController')
const config = require('../config/index');
/* GET home page. */


router.get('/personHis', registedController.index);

// router.get('/showRegisted/:id',checkToken, registedController.showRegistedById);

// router.post('/addPerson',checkToken, registedController.addPerson);

// router.post('/addCancer',checkToken, registedController.addCancer);

// router.post('/addTreatment',checkToken, registedController.addTreatment);

module.exports = router;
