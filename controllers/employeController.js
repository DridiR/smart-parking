const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employe = require('../models/Employe');

//get all employes
exports.all = (req, res) => {
    Employe.find()
    .then(employes => res.status(200).json(employes))
    .catch(err => res.status(400).json({error: err.message}));
};

// get employes by id
exports.get = (req, res, next) => {
    Employe.findOne({_id: req.params.id})
    .then(employes => res.status(200).json(employes))
    .catch(err => res.status(404).json({error: err.message}));
};

exports.getAllAssistantClients = async (req, res, next) => {
    try {
        // Recherche de tous les assistants clients
        const assistants = await Employe.find({ role: 'Assistant client' });

        if (!assistants || assistants.length === 0) {
            return res.status(404).json({ message: 'Aucun assistant client trouvé' });
        }

        res.status(200).json(assistants);
    } catch (error) {
        console.error('Erreur lors de la récupération des assistants clients:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des assistants clients' });
    }
};
exports.login = (req, res, next) => {
    const { email, password } = req.body;
    Employe.findOne({ email: email })
        .then(employe => {
            if (!employe) {
                return res.status(401).json({
                    message: "Auth failed, email not found"
                });
            }
            bcrypt.compare(password, employe.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: "Auth failed, incorrect password"
                        });
                    }    

                    const token = jwt.sign(
                        { employeId: employe._id },
                        'RANDOM_TOKEN_SECRET'
                    );
                    
                    res.status(200).json({
                        message: "Auth successful",
                        employeId: employe._id,
                        firstName: employe.firstName,
                        lastName: employe.lastName,
                        role: employe.role,
                        token: token
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

//delete a employes
exports.delete = (req, res, next) => {
    Employe.deleteOne({ _id: req.params.id })
     .then(() => res.status(200).json({ message: 'employes deleted !'}))
     .catch(error => res.status(400).json({ error }));
 
 };