const Admin = require('../models/Admin');
const Employe = require('../models/Employe')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//get all admins
exports.all = (req, res) => {
    Admin.find()
    .then(admins => res.status(200).json(admins))
    .catch(err => res.status(400).json({error: err.message}));
};


exports.signup = (req, res, next) => {
    // Vérification de la présence de l'email et du mot de passe
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "L'email et le mot de passe sont requis.",
            status: 400
        });
    }

    // Vérification de la validité de l'email
    // (vous pouvez utiliser une expression régulière ou une bibliothèque comme validator.js pour cette vérification)
    // Exemple avec une expression régulière simple :
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            message: "L'email n'est pas valide.",
            status: 400
        });
    }

    // Vérification de la longueur du mot de passe
    if (req.body.password.length < 6) {
        return res.status(400).json({
            message: "Le mot de passe doit contenir au moins 6 caractères.",
            status: 400
        });
    }

    // Hashage du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const admin = new Admin({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: hash
        });
        admin.save()
        .then(() => res.status(201).json({
            message: 'Admin créé !',
            status: 201
        }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};



 exports.login = (req, res, next) => {
  const { email, password } = req.body; // Extraire l'email et le mot de passe du corps de la requête
  
  Admin.findOne({ email: email })
      .then(admin => {
          if (!admin) {
              return res.status(401).json({ error: 'Admin not found !' });
          }
      
          bcrypt.compare(password, admin.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ error: 'Wrong password !' });
                  }
                  res.status(200).json({
                      adminId: admin._id,
                      firstName: admin.firstName,
                      lastName: admin.lastName,
                      token: jwt.sign(
                          { adminId: admin._id },
                          'RANDOM_TOKEN_SECRET'
                      )
                  });
              })
              .catch(error => {
                  console.error('Password Comparison Error:', error);
                  res.status(500).json({ error: 'Password comparison failed.' });
              });
      })
      .catch(error => {
          console.error('Admin Lookup Error:', error); 
          res.status(500).json({ error: 'Admin lookup failed.' });
      });
};

exports.profile = (req, res, next) => {
    Admin.findOne({ _id: req.params.id })
      .then(admin => res.status(200).json(admin))
      .catch(error => res.status(500).json({ error }));
  };
//to update a admin by id
exports.update = (req, res, next) => {
   Admin.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(201).json({ message: 'admin updated !'}))
    .catch(error => res.status(400).json({ error }));

};

//delete  admin
exports.delete = (req, res, next) => {
    Admin.deleteOne({ _id: req.params.id })
     .then(() => res.status(200).json({ message: 'admin deleted !'}))
     .catch(error => res.status(400).json({ error }));
 
 };



// Méthode pour ajouter un compte employe
exports.addEmploye = (req, res, next) => {
    // Vérification de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Vérification du mot de passe (par exemple, une longueur minimale de 6 caractères)
    if (req.body.password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Vérification du numéro de téléphone
    const phoneNumberRegex = /^[2|4|5|9]\d{7}$/; // Premier chiffre doit être 2, 4, 5 ou 9, suivi de 7 autres chiffres
    if (!phoneNumberRegex.test(req.body.phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const employe = new Employe({
            firstName: req.body.firstName,
            lastName :  req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role,
            email: req.body.email,
            password: hash
        });

        employe.save()
            .then(() => res.status(201).json({
                message: 'Employe created successfully!',
                status: 201
            }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};