
const Message = require('../models/Message');
const Employe = require('../models/Employe'); // Importez le modèle Employe
// Envoi d'un nouveau message
// Envoi d'un nouveau message
exports.sendMessage = async (req, res) => {
    try {
      const { sender, content } = req.body;
  
      // Recherche de tous les assistants clients
      const assistants = await Employe.find({ role: 'Assistant client' });
  
      if (!assistants || assistants.length === 0) {
        return res.status(404).json({ message: 'Aucun assistant client trouvé' });
      }
  
      // Création d'un nouveau message avec tous les assistants comme destinataires
      const newMessage = new Message({
        sender,
        recipients: assistants.map(assistant => assistant._id), // Utilisation de recipients au lieu de recipient
        content
      });
  
      // Enregistrement du message dans la base de données
      const savedMessage = await newMessage.save();
  
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'An error occurred while sending the message' });
    }
  };

// Récupération de tous les messages d'un utilisateur spécifique
exports.getMessagesByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Recherche des messages pour l'utilisateur spécifié
      const messages = await Message.find({ sender: userId }); // Utilisation de recipients au lieu de recipient
  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
  }

// Récupération de tous les messages
exports.getAllMessages = async (req, res) => {
  try {
    // Récupération de tous les messages
    const messages = await Message.find();

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'An error occurred while fetching messages' });
  }
};
