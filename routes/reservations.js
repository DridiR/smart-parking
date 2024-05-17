const express = require('express');
const router = express.Router();

const reservationcontroller = require('./../controllers/reservationController');


router.get('/unpaid', reservationcontroller.all);
router.get('/paid', reservationcontroller.paid);

router.get('/:id',reservationcontroller.get);
router.post('/', reservationcontroller.create);
router.put('/:id', reservationcontroller.update);
router.delete('/:id',reservationcontroller.delete);
router.delete('/delete/:id',reservationcontroller.delete);
router.get('/my/:userId', reservationcontroller.getUserReservations);
router.get('/myrespaid/:userId', reservationcontroller.getUserReservationspaid);

module.exports = router;
