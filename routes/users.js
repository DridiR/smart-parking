const express=require('express');

const router=express.Router();
const userController =require('../controllers/userController');
const {createUser, userSignIn,getUserProfile}=require('../controllers/userController');
const { isAuth, validateUserSignUp, userValidation, validateUserSignIn } = require('../middelwares/Authusers');

router.get('/users', userController.all);
router.get('/profil', isAuth, getUserProfile);
router.post('/create-user',validateUserSignUp,userValidation,createUser);
router.post('/sign-in',validateUserSignIn,userValidation,userSignIn);
router.get('/users/:id',userController.get);
// Route pour ajouter le jeton de notification à l'utilisateur
router.post('/users/notificationToken', isAuth, userController.addNotificationToken);

module.exports=router;