const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
    reservationId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const Paiement = mongoose.model('Paiement', paiementSchema);

module.exports = Paiement;