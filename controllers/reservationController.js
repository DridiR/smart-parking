const Reservation = require('../models/Reservation');
const Emplacement = require('../models/Emplacement');

const Annulation = require('../models/Annulation');

const User = require('../models/User');
const Notification = require('../controllers/notificationController');


// get all unpaid reservations
exports.all = (req, res) => {
    Reservation.find({ paye: false })
    .then(reservations => res.status(200).json(reservations))
    .catch(err => res.status(400).json({ error: err.message }));
};
// get all paid reservations
exports.paid = (req, res) => {
    Reservation.find({ paye: true })
    .then(reservations => res.status(200).json(reservations))
    .catch(err => res.status(400).json({ error: err.message }));
};
// get reservation by id
exports.get = (req, res, next) => {
    Reservation.findOne({_id: req.params.id})
    .then(reservations => res.status(200).json(reservations))
    .catch(err => res.status(404).json({error: err.message}));
};


exports.create = async (req, res) => {
    try {
        const { date, heure_deb, heure_fin, matricule, user, emplacementId } = req.body;

        let statutid;
        const now = new Date();
        const dateLimite = new Date(now.getTime() + (48 * 60 * 60 * 1000)); // 48 heures en millisecondes
        const reservationDate = new Date(date + 'T' + heure_deb);
        const heureFinDate = new Date(date + 'T' + heure_fin);
        
        if (reservationDate < now) {
            return res.status(409).json({
                error: "La date de reservation est invalide"
            });
        } else if (reservationDate > dateLimite) {
            return res.status(409).json({
                error: "La date et l'heure invalide"
            })
        } else if (heureFinDate <= reservationDate) {
            return res.status(409).json({
                error: "l heure fin est invalide "
            });
        } else {
            statutid = reservationDate > now ? "n'est pas encore" : "en cours";
        }

        const emplacement = await Emplacement.findById(emplacementId);
        if (!emplacement) {
            throw new Error("Emplacement non trouvé");
        }

        // Calcul du tarif de la réservation
        const heuresReservees = (heureFinDate - reservationDate) / (60 * 60 * 1000); // Convertir la différence en heures
        const tarifReservation = emplacement.tarif * heuresReservees;

        const reservation = new Reservation({
            date,
            heure_deb,
            heure_fin,
            matricule,
            statut: statutid,
            tarif: tarifReservation, // Ajout de l'attribut tarif
            paye:false,
            user,
            emplacementId,
           
        });

        await reservation.save();

        // Ajouter la réservation au calendrier de l'emplacement
        const calendrier = {
            date: new Date(date),
            horaires: [{
                heure_deb,
                heure_fin
            }]
        };
        emplacement.calendriers.push(calendrier);

        await emplacement.save();
       /* Fetch user's notification token from database
       const { userId } = req.body;
       const userr = await User.findById(userId);
       if (!userr) {
           return res.status(404).json({ message: 'Utilisateur non trouvé' });
       }
       const notificationToken = userr.notificationToken;

       // Send notification
       const title = 'Nouvelle réservation';
       const body = 'Une nouvelle réservation a été créée';
       await Notification.sendNotification([notificationToken], title, body);

*/


        res.status(201).json({ message: "Réservation créée" });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la réservation" });
    }
};

//to update a reservation by id
exports.update = (req, res, next) => {
    Reservation.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(201).json({ message: 'Reservation updated !'}))
    .catch(error => res.status(400).json({ error }));

};

exports.getUserReservations = async (req, res) => {
    try {
        // Vérifier si l'ID utilisateur est présent dans les paramètres de requête
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: 'ID utilisateur manquant dans les paramètres de la requête' });
        }

        // Rechercher la réservation pour l'ID utilisateur donné
        const userReservation = await Reservation.find({ user: userId, paye: false  });

        // Si aucune réservation trouvée, retourner un message approprié
        if (!userReservation) {
            return res.status(404).json({ message: 'Aucune réservation trouvée pour cet utilisateur' });
        }

        // Retourner la réservation trouvée
        res.status(200).json(userReservation);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur approprié
        console.error('Erreur lors de la récupération de la réservation de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.getUserReservationspaid = async (req, res) => {
    try {
        // Vérifier si l'ID utilisateur est présent dans les paramètres de requête
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: 'ID utilisateur manquant dans les paramètres de la requête' });
        }

        // Rechercher la réservation pour l'ID utilisateur donné
        const userReservation = await Reservation.find({ user: userId, paye: true  });

        // Si aucune réservation trouvée, retourner un message approprié
        if (!userReservation) {
            return res.status(404).json({ message: 'Aucune réservation trouvée pour cet utilisateur' });
        }

        // Retourner la réservation trouvée
        res.status(200).json(userReservation);
    } catch (error) {
        // En cas d'erreur, retourner un message d'erreur approprié
        console.error('Erreur lors de la récupération de la réservation de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
  
  //delete a employes
exports.delete = (req, res, next) => {
    Reservation.deleteOne({ _id: req.params.id })
     .then(() => res.status(200).json({ message: 'reservation deleted !'}))
     .catch(error => res.status(400).json({ error }));
 
 };

 
exports.delete = async (req, res, next) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id });
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Enregistrer l'annulation dans la table d'annulation
        const annulation = new Annulation({
            reservation: reservation._id,
            date: new Date() // Date d'annulation actuelle
        });
        await annulation.save();

        // Supprimer la réservation
        await Reservation.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Reservation deleted!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting reservation" });
    }
};


