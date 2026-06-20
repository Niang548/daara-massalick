const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { envoyerMessageContact } = require('../services/emailService');

router.post('/creer-mot-de-passe/:token', async (req, res) => {
  try {
    const { mot_de_passe } = req.body;
    const { token } = req.params;

    if (!mot_de_passe || mot_de_passe.length < 6)
      return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' });

    const [rows] = await db.query(
      'SELECT * FROM membres WHERE token_creation = ? AND token_expiration > NOW()',
      [token]
    );

    if (rows.length === 0)
      return res.status(400).json({ success: false, message: 'Lien invalide ou expiré' });

    const hash = await bcrypt.hash(mot_de_passe, 10);

    await db.query(
      `UPDATE membres 
       SET mot_de_passe = ?, compte_active = TRUE, token_creation = NULL, token_expiration = NULL
       WHERE id = ?`,
      [hash, rows[0].id]
    );

    res.json({ success: true, message: 'Mot de passe créé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM membres WHERE email = ? AND compte_active = TRUE',
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const membre = rows[0];
    const valide = await bcrypt.compare(mot_de_passe, membre.mot_de_passe);

    if (!valide)
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign(
      { id: membre.id, email: membre.email, type: 'membre' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      membre: {
        id: membre.id, prenom: membre.prenom, nom: membre.nom,
        email: membre.email, statut: membre.statut
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Vérifier si un token est valide (utilisé par la page de création de mot de passe)
router.get('/verifier-token/:token', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT prenom, email FROM membres WHERE token_creation = ? AND token_expiration > NOW()',
      [req.params.token]
    );
    if (rows.length === 0)
      return res.status(400).json({ success: false, message: 'Lien invalide ou expiré' });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
const jwtMiddleware = require('../middleware/auth');

router.get('/mes-cotisations', jwtMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cotisations WHERE membre_id = ? ORDER BY mois DESC',
      [req.membreId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/mon-profil', jwtMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, prenom, nom, telephone, email, adresse, statut, niveau_coranique, contact_urgence, date_naissance, date_inscription FROM membres WHERE id = ?',
      [req.membreId]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Membre introuvable' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.put('/mon-profil', jwtMiddleware, async (req, res) => {
  try {
    const { prenom, nom, telephone, email, adresse, contact_urgence, date_naissance, niveau_coranique } = req.body;

    if (!prenom || !nom || !telephone)
      return res.status(400).json({ success: false, message: 'Prénom, nom et téléphone sont obligatoires' });

    await db.query(
      `UPDATE membres 
       SET prenom = ?, nom = ?, telephone = ?, email = ?, adresse = ?, contact_urgence = ?, date_naissance = ?, niveau_coranique = ?
       WHERE id = ?`,
      [prenom, nom, telephone, email, adresse, contact_urgence, date_naissance || null, niveau_coranique || null, req.membreId]
    );

    res.json({ success: true, message: 'Profil mis à jour avec succès' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ success: false, message: 'Ce numéro de téléphone est déjà utilisé par un autre membre' });
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get('/xassida', jwtMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM xassida ORDER BY date_ajout DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get('/annonces', jwtMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM annonces WHERE publie = TRUE ORDER BY date_publication DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/medias', jwtMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM medias';
    const params = [];
    if (type) { query += ' WHERE type = ?'; params.push(type); }
    query += ' ORDER BY date_ajout DESC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.post('/contact', jwtMiddleware, async (req, res) => {
  try {
    const { sujet, message } = req.body;

    if (!sujet || !message)
      return res.status(400).json({ success: false, message: 'Le sujet et le message sont obligatoires' });

    const [rows] = await db.query(
      'SELECT prenom, nom, email FROM membres WHERE id = ?',
      [req.membreId]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Membre introuvable' });

    const membre = rows[0];
    const nomComplet = `${membre.prenom} ${membre.nom}`;

    await envoyerMessageContact(nomComplet, membre.email, sujet, message);

    res.json({ success: true, message: 'Votre message a été envoyé à l\'administration' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;