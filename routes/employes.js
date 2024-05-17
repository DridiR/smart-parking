const express = require('express');
const router = express.Router();

const employecontroller = require('../controllers/employeController');

router.post('/loginEmploye', employecontroller.login);
router.get('/assistant',employecontroller.getAllAssistantClients);
router.get('/',employecontroller.all);
router.get('/:id',employecontroller.get);
router.delete('/:id',employecontroller.delete);


module.exports = router;