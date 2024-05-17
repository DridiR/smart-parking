const express = require('express');
const router = express.Router();

const annulationcontroller = require('./../controllers/annulationController');
router.get('/', annulationcontroller.all);


module.exports = router;