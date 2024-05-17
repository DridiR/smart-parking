const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    heure_deb: { type: String, required: true },
    heure_fin: { type: String, required: true },
    matricule: { type: Number, required: true },
    statut: { type: String, required: true },
    tarif: { type: Number, required: true },
    paye: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Référence à l'ID de l'utilisateur
    emplacementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Emplacement' } // Référence à l'ID de l'emplacement
    
});

module.exports = mongoose.model('Reservation', reservationSchema);
