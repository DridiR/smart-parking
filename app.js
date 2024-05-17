const express =require('express');
const mongoose = require('mongoose');

const adminrouter = require('./routes/admins');
const userrouter = require('./routes/users');
const employerouter =require('./routes/employes');
const annulationrouter =require('./routes/annulations');
const emplacementrouter =require('./routes/emplacements');
const reservationtrouter =require('./routes/reservations');
const messagerouter =require('./routes/messages');
const questionrouter =require('./routes/questions');
const paiementRoutes =require('./routes/paiements');
const notificationRoutes= require('./routes/notifications');
const app = express();

mongoose.connect("mongodb://localhost:27017/SmartParking")
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  app.use(express.json());
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

app.use( userrouter);

 app.use('/api', paiementRoutes);
app.use('/messages', messagerouter);
  app.use('/admins', adminrouter);
app.use('/emplacements',emplacementrouter);
 app.use('/employes', employerouter);
app.use('/annulations',annulationrouter)
 app.use('/reservations',reservationtrouter);
 app.use('/questions',questionrouter);

 app.use('/notifications',notificationRoutes);
module.exports = app;