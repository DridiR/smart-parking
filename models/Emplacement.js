const mongoose = require('mongoose');

const horaireSchema = new mongoose.Schema({
    heure_deb: { type: String, required: true },
    heure_fin: { type: String, required: true } 
});

const calendrierSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    horaires: [horaireSchema] // Un tableau d'objets horaire pour chaque jour
});

const emplacementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['sécurité élevée', 'sécurité moyenne'],
        required: true
    },
    tarif: { type: Number, required: true },
    
    calendriers: [calendrierSchema], // Un tableau de calendriers pour chaque emplacement
   // reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
});

module.exports = mongoose.model('Emplacement', emplacementSchema);


