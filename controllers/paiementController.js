
const stripe = require('stripe')('sk_test_51PFgU11I87K0yV3RTrzC2C9ldGciwAeO5nefKx6uCWdAFAiGQMSBqnh0TuixYHJXH6u4qNpDp3YPfhsm9fT6e6jK004lippq6K');
const Paiement = require('../models/Paiement');
exports.create = async (req, res) => {
    try {
        console.log("Requête de paiement reçue !");
        const { reservationId, montant } = req.body;

        // Créer le paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: montant * 100,
            currency: 'eur',
            metadata: { reservationId: reservationId }
        });

        // Enregistrer le paiement dans la base de données
        const paiement = new Paiement({
            reservationId: reservationId,
            amount: montant,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status
        });
        await paiement.save();

        // Renvoyer l'identifiant du paiement client à l'interface utilisateur
        res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Erreur lors du paiement:', error);
        res.status(500).json({ message: "Erreur lors du paiement" });
    }
};