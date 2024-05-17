const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        default: null
    },
    adminAnswer: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence vers le modèle User
        default: null
    }
});

module.exports = mongoose.model('Question', questionSchema);   