const Emplacement = require('../models/Emplacement');

// Obtenir la liste des emplacements
exports.all = (req, res) => {
    Emplacement.find()
    .then(emplacements => res.status(200).json(emplacements))
    .catch(err => res.status(400).json({error: err.message}));
};

// get emplacement by id
exports.get = (req, res, next) => {
    Emplacement.findOne({_id: req.params.id})
    .then(emplacements => res.status(200).json(emplacements))
    .catch(err => res.status(404).json({error: err.message}));
};
// Store a new emplacement
exports.create = (req, res, next) => {
    // Récupérer les données de la requête du frontend
    const { name, type } = req.body;

    // Déterminer le tarif en fonction du type
    let tarif;
    if (type === "sécurité élevée") {
        tarif = 4000;
    } else {
        tarif = 3000;
    }

    // Créer une nouvelle instance d'emplacement avec les données reçues, y compris la disponibilité, le tarif, le type et les calendriers
    const emplacement = new Emplacement({
        name,
        type, 
        tarif,
        calendriers:[]
    });

    // Enregistrer l'emplacement dans la base de données
    emplacement.save()
    .then(() => res.status(201).json({ message: 'Emplacement créé !'}))
    .catch(error => res.status(400).json({ error }));
};

//to update a emplacement by id
exports.update = (req, res, next) => {
    Emplacement.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(201).json({ message: 'emplacement updated !'}))
    .catch(error => res.status(400).json({ error }));

};


//delete a emplacement
exports.delete = (req, res, next) => {
    Emplacement.deleteOne({ _id: req.params.id })
     .then(() => res.status(200).json({ message: 'emplacement deleted !'}))
     .catch(error => res.status(400).json({ error }));
 
 };

 // Récupérer les calendriers d'un emplacement par son ID
exports.getCalendriersByEmplacementId = (req, res, next) => {
    Emplacement.findById(req.params.id)
    .then(emplacement => {
        if (!emplacement) {
            return res.status(404).json({ error: "Emplacement not found" });
        }
        res.status(200).json({ calendriers: emplacement.calendriers });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getEmplacementsDisponibles = async (req, res, next) => {
    try {
        const { date, heureDeb, heureFin } = req.query;
        const parsedDate = new Date(date);

        const emplacementsDisponibles = await Emplacement.find({
            $or: [
              { 
                $and: [
                  { 'calendriers.date': parsedDate },
                  { 'calendriers.horaires': { $not: { $elemMatch: { 
                    $or: [
                      { 
                        $and: [
                          { heure_deb: { $gte: heureDeb, $lt: heureFin } },
                          { heure_fin: { $gt: heureDeb, $lte: heureFin } }
                        ]
                      },
                      { 
                        $and: [
                          { heure_deb: { $gte: heureDeb } },
                          { heure_fin: { $lte: heureFin } }
                        ]
                      },
                      { 
                        $and: [
                          { heure_deb: { $lte: heureDeb } },
                          { heure_fin: { $gte: heureFin } }
                        ]
                      },
                      { 
                        $and: [
                          { heure_deb: { $gt: heureDeb } },
                          { heure_fin: { $lt: heureFin } }
                        ]
                      }
                    ]
                  } } } }
                ]
              },
              { 'calendriers.date': { $ne: parsedDate } },
              { 'calendriers': { $exists: false } }
            ]
          });
          

        if (emplacementsDisponibles.length > 0) {
            res.json(emplacementsDisponibles);
        } else {
            res.status(404).json({ message: 'Aucun emplacement disponible pour la date et les heures sélectionnées.' });
        }
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des emplacements disponibles.' });
    }
};
