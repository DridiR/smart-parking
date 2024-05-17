
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const annulationSchema = new Schema({
    reservation: { type: Schema.Types.ObjectId, ref: 'Reservation', required: true }, // Référence à la réservation annulée
    date: { type: Date, default: Date.now } // Date et heure de l'annulation
});

module.exports = mongoose.model('Annulation', annulationSchema);
