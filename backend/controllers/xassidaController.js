const db = require('../config/database');

exports.getTousXassida = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM xassida ORDER BY date_ajout DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getXassidaById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM xassida WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Xassida introuvable' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.ajouterXassida = async (req, res) => {
  try {
    const { titre, auteur, description, categorie, langue } = req.body;
    const pdf   = req.files?.pdf?.[0]?.filename   ? '/uploads/' + req.files.pdf[0].filename   : null;
    const audio = req.files?.audio?.[0]?.filename ? '/uploads/' + req.files.audio[0].filename : null;

    const [result] = await db.query(
      `INSERT INTO xassida (titre, auteur, description, fichier_pdf, fichier_audio, categorie, langue)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titre, auteur || null, description || null, pdf, audio, categorie || null, langue || 'arabe']
    );
    res.status(201).json({ success: true, message: 'Xassida ajouté', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.supprimerXassida = async (req, res) => {
  try {
    await db.query('DELETE FROM xassida WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Xassida supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};