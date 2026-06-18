const db = require('../config/database');

exports.getTousMedias = async (req, res) => {
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
};

exports.ajouterMedia = async (req, res) => {
  try {
    const { titre, type, evenement, date_media } = req.body;
    const url = req.file ? '/uploads/' + req.file.filename : null;
    if (!url) return res.status(400).json({ success: false, message: 'Fichier manquant' });

    const [result] = await db.query(
      `INSERT INTO medias (titre, type, url, evenement, date_media) VALUES (?, ?, ?, ?, ?)`,
      [titre, type, url, evenement || null, date_media || null]
    );
    res.status(201).json({ success: true, message: 'Média ajouté', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.supprimerMedia = async (req, res) => {
  try {
    await db.query('DELETE FROM medias WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Média supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};