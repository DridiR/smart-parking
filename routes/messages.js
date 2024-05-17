const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Routes pour les messages
router.post('/', messageController.sendMessage);
router.get('/:userId', messageController.getMessagesByUser);
router.get('/', messageController.getAllMessages);

module.exports = router;