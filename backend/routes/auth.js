const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Créer un admin (à utiliser une seule fois pour le premier compte)
router.post('/register', async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;
    const hash = await bcrypt.hash(mot_de_passe, 10);
    await db.query(
      'INSERT INTO admins (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
      [nom, email, hash, role || 'admin']
    );
    res.status(201).json({ success: true, message: 'Compte admin créé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Connexion admin
router.post('/login', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const admin = rows[0];
    const valide = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!valide)
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ success: true, token, admin: { id: admin.id, nom: admin.nom, role: admin.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;