const { check, validationResult } = require('express-validator');
const jwt =require('jsonwebtoken');

const User = require('../models/User');


exports.isAuth = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decode = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            const user = await User.findById(decode.userId);
            if (!user) {
                return res.json({ success: false, message: 'Unauthorized access!' });
            }
  
            // Ajouter l'utilisateur à l'objet req
            req.user = user;
            next();
        } catch (error) {
            // Gestion des erreurs de vérification du token
            if (error.name === 'JsonWebTokenError') {
                return res.json({ success: false, message: 'Unauthorized access!' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.json({ success: false, message: 'Session expired, please sign in again!' });
            }
            res.json({ success: false, message: 'Internal server error!' });
        }
    } else {
        res.json({ success: false, message: 'Unauthorized access!' });
    }
  };
  


exports.validateUserSignUp = [
    // Vos règles de validation pour l'inscription des utilisateurs
];

exports.userValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

exports.validateUserSignIn = [
    // Vos règles de validation pour la connexion des utilisateurs
];
