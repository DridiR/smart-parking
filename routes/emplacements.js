const express = require('express');
const router = express.Router();

const emplacementcontroller = require('../controllers/emplacementController');

router.get('/', emplacementcontroller.all);

router.post('/', emplacementcontroller.create);
router.put('/:id', emplacementcontroller.update);
router.delete('/:id',emplacementcontroller.delete);

router.get('/disponibles',emplacementcontroller.getEmplacementsDisponibles);
// Route pour obtenir tous les calendriers de tous les emplacements
router.get('/calendriers/:id', emplacementcontroller.getCalendriersByEmplacementId);

router.get('/:id',emplacementcontroller.get);

module.exports = router;
