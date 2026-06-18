const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM annonces WHERE publie = TRUE ORDER BY date_publication DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titre, contenu, date_evenement, lieu, priorite } = req.body;
    const [result] = await db.query(
      'INSERT INTO annonces (titre, contenu, date_evenement, lieu, priorite) VALUES (?, ?, ?, ?, ?)',
      [titre, contenu || null, date_evenement || null, lieu || null, priorite || 'normale']
    );
    res.status(201).json({ success: true, message: 'Annonce publiée', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('UPDATE annonces SET publie = FALSE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Annonce archivée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;