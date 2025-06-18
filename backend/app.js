const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Connexion à la base MongoDB puis lancement du serveur
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${process.env.PORT}`);
  });
});
