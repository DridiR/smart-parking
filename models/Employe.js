const mongoose = require('mongoose');


const employeSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    role: {
        type: String,
        enum: ['Responsable', 'Assistant client'],
        required: true
    },
    email: {type: String, required: true},   
    password: {type: String, required: true}
});

 module.exports = mongoose.model('Employe', employeSchema);
