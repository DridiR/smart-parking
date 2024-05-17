// c'est le middleware qui va controller l'authentification 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const adminId = decodedToken.adminId;
    if (!req.headers.adminid) {
        throw 'Bad adminID request';
    } else if (req.headers.adminid !== adminId) {
      throw 'Invalid admin ID';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
};