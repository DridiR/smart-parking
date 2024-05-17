
const Question = require('../models/Question');

// Get all questions and answers
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({ userId: { $ne: null } }); // Retourne les questions où userId est défini
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get questions and answers for a specific user
exports.getUserQuestions = async (req, res) => {
    const userId = req.params.userId;

    try {
        const userQuestions = await Question.find({ userId: userId });
        res.json(userQuestions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new question and answer
exports.addQuestion = async (req, res) => {
    const { question, answer } = req.body;

    const newQuestion = new Question({
        question,
        answer,
        adminAnswer: null // adminAnswer initialisé à null
    });

    try {
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Add a new question
exports.Questionuser = async (req, res) => {
    const { question } = req.body;

    try {
        // Rechercher la question dans la base de données
        const existingQuestion = await Question.findOne({ question: new RegExp(question, 'i') });

        if (existingQuestion) {
            // Si la question existe déjà dans la base de données, retourner la réponse associée
            if (existingQuestion.answer) {
                return res.json({ answer: existingQuestion.answer });
            } else {
                // Si la réponse n'est pas encore fournie par l'administrateur, retourner un message d'attente
                return res.json({ message: "Attendez la réponse de l'administrateur" });
            }
        } else {
            const userId = req.params.userId;
            // Sinon, ajouter la question à la base de données
            const newQuestion = new Question({
                question,
                userId: userId, // Enregistrer l'identifiant de l'utilisateur avec la question
                answer: "Nous vous répondrons dès que possible",
                adminAnswer: null
            });

            const savedQuestion = await newQuestion.save();
            res.status(201).json(savedQuestion);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Ajouter une réponse à une question
exports.addAdminAnswer = async (req, res) => {
    const { questionId, adminAnswer } = req.body;

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        
        question.adminAnswer = adminAnswer;
        await question.save();

        res.json({ message: "Admin answer added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
