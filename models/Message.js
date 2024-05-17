const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employe',
        required: true
    }],
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    });


 module.exports = mongoose.model('message', messageSchema);
