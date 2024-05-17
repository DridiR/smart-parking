const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Route pour récupérer toutes les questions et réponses
router.get('/', questionController.getAllQuestions);

// Route pour ajouter une nouvelle question
router.post('/', questionController.addQuestion);


// Route pour récupérer les questions et réponses d'un utilisateur par son ID
router.get('/user/:userId', questionController.getUserQuestions);

// Route pour ajouter une question posée par un utilisateur
router.post('/user/:userId', questionController.Questionuser);

// Route pour ajouter une réponse à une question par l'administrateur
router.post('/admin/answer', questionController.addAdminAnswer);

module.exports = router;
