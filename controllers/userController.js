const jwt =require('jsonwebtoken');
const User=require('../models/User');

//get all users
exports.all = (req, res) => {
    User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json({error: err.message}));
};

// get user by id
exports.get = (req, res, next) => {
    User.findOne({_id: req.params.id})
    .then(users => res.status(200).json(users))
    .catch(err => res.status(404).json({error: err.message}));
};

exports.createUser=async (req,res)=>{
    const {fullname,email,password}=req.body
const isNewUser= await  User.isThisEmailInUse(email);
if(!isNewUser)return res.json({
    success:false,
    message:'this email is already in use ,try sign-in',
});
const notificationToken = null
const user = await User({fullname,email ,password,notificationToken})
 await user.save()
res.json({success:true,user});
};
exports.userSignIn=async (req,res)=>{
   const {email,password}= req.body

  const user =await User.findOne({email})
  if(!user)return res.json({success:false,message:'user not found,with the given email'});
  const isMatch= await user.comparePassword(password)
if(!isMatch)return  res.json({success:false,message:'email/password does  not match '});

 const token = jwt.sign({userId:user._id},'RANDOM_TOKEN_SECRET',{expiresIn:'1d'})


res.json({success:true,user,token});
};
exports.getUserProfile = async (req, res) => {
    try {
        // Récupérer les détails de l'utilisateur à partir de l'utilisateur authentifié
        const user = req.user;
        // Omettre le mot de passe pour des raisons de sécurité
        const { _id, fullname, email } = user;
        res.json({ success: true, user: { _id, fullname, email } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

exports.addNotificationToken = async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id;

  try {
      console.log('User ID:', userId);
      console.log('Notification Token:', token);

      const user = await User.findByIdAndUpdate(userId, { notificationToken: token });
      console.log('Updated User:', user);

      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.status(200).json({ message: 'Token de notification enregistré avec succès' });
  } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token de notification:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
