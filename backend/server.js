const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Permet au frontend React d'appeler cette API
app.use(cors());

// Permet de lire le JSON envoyé dans les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rend le dossier uploads accessible publiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Branchement des routes
app.use('/api/membres',     require('./routes/membres'));
app.use('/api/cotisations', require('./routes/cotisations'));
app.use('/api/xassida',     require('./routes/xassida'));
app.use('/api/medias',      require('./routes/medias'));
app.use('/api/annonces',    require('./routes/annonces'));
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/membre-auth', require('./routes/membreAuth'));
// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'API Daara Massalick opérationnelle ✓', version: '1.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});