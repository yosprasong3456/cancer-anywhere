const express = require('express');
const router = express.Router();
const hisController = require('../controllers/hisController')
const verifyToken = require('../middleware/authJWT')

router.get('/getPerson',verifyToken, hisController.getPerson);
router.get('/getPersonCA',verifyToken, hisController.getPersonCA);
router.post('/sendToCA',verifyToken, hisController.sendData);
router.post('/getOnePerson/',verifyToken, hisController.addPersonOnly);
router.get('/getPersonSearch/:id',verifyToken, hisController.personSearch);





module.exports = router;
