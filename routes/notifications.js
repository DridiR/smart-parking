
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

// Route for creating notifications
router.post('/', async (req, res) => {
  const { userId, message } = req.body;
  try {
    await NotificationController.createNotification(userId, message);
    res.status(201).json({ message: "Notification created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating notification" });
  }
});

module.exports = router;