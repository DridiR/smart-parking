const express = require('express');
const router = express.Router();

const admincontroller = require('./../controllers/adminController');

const auth = require('./../middelwares/Auth');

router.get('/profile/:id', auth, admincontroller.profile);
router.post('/signup', admincontroller.signup);
router.post('/login', admincontroller.login);

router.get('/', admincontroller.all);

router.post('/employes/add', admincontroller.addEmploye);

router.put('/:id', admincontroller.update);
router.delete('/:id', admincontroller.delete);

module.exports = router;
