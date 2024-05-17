const express = require('express');
const router = express.Router();
//const paiementController = require('../controllers/paiementController');
const paiementController=require('../controllers/paiementController');
// Route pour effectuer un paiement
router.post('/paiement', paiementController.create);

module.exports = router;
