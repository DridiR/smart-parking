const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKeys.json');
const User = require('../models/User'); // Importez votre modèle utilisateur

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fonction pour envoyer une notification
async function sendNotification(userId, message) {
  const registrationToken = await getUserRegistrationToken(userId);

  const payload = {
    notification: {
      title: 'Réservation de parking',
      body: message,
    },
  };

  try {
    await admin.messaging().sendToDevice(registrationToken, payload);
    console.log('Notification envoyée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification :', error);
  }
}

// Fonction pour récupérer le jeton d'enregistrement de l'utilisateur
async function getUserRegistrationToken(userId) {
  // Récupérez le jeton d'enregistrement de l'utilisateur depuis votre base de données
  const user = await User.findById(userId);
  return user.firebaseToken; // Assurez-vous que le champ s'appelle firebaseToken dans votre modèle utilisateur
}

module.exports = {
  sendNotification
};
