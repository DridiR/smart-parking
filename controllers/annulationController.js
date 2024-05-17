const Annulation = require('../models/Annulation');

// Obtenir la liste des emplacements
exports.all = (req, res) => {
    Annulation.find()
    .then(annulations => res.status(200).json(annulations))
    .catch(err => res.status(400).json({error: err.message}));
};