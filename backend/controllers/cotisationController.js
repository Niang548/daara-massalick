const db = require('../config/database');

exports.getToutesCotisations = async (req, res) => {
  try {
    const { mois, statut } = req.query;
    let query = `
      SELECT c.*, m.prenom, m.nom, m.telephone
      FROM cotisations c
      JOIN membres m ON c.membre_id = m.id
      WHERE m.actif = TRUE`;
    const params = [];

    if (mois)   { query += ' AND c.mois = ?';    params.push(mois); }
    if (statut) { query += ' AND c.statut = ?';  params.push(statut); }
    query += ' ORDER BY c.created_at DESC';

    const [rows] = await db.query(query, params);
    res.json({ success: true, total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStatistiques = async (req, res) => {
  try {
    const moisActuel = new Date().toISOString().slice(0, 7) + '-01';
    const [[stats]] = await db.query(`
      SELECT
        COUNT(*) AS total_membres,
        SUM(CASE WHEN statut='paye' THEN 1 ELSE 0 END) AS membres_payes,
        SUM(CASE WHEN statut='retard' THEN 1 ELSE 0 END) AS membres_retard,
        SUM(CASE WHEN statut='paye' THEN montant ELSE 0 END) AS total_collecte
      FROM cotisations WHERE mois = ?`, [moisActuel]);
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCotisationsParMembre = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cotisations WHERE membre_id = ? ORDER BY mois DESC',
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.enregistrerCotisation = async (req, res) => {
  try {
    const { membre_id, montant, mois, mode_paiement, note } = req.body;
    if (!membre_id || !mois)
      return res.status(400).json({ success: false, message: 'membre_id et mois sont obligatoires' });

    const recu = 'REC-' + Date.now();
    const [result] = await db.query(
      `INSERT INTO cotisations (membre_id, montant, mois, mode_paiement, date_paiement, recu_numero, statut, note)
       VALUES (?, ?, ?, ?, NOW(), ?, 'paye', ?)`,
      [membre_id, montant || 2000, mois, mode_paiement || 'especes', recu, note || null]
    );
    res.status(201).json({ success: true, message: 'Cotisation enregistrée', recu_numero: recu, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.modifierCotisation = async (req, res) => {
  try {
    const { statut, montant, mode_paiement, note } = req.body;
    await db.query(
      'UPDATE cotisations SET statut=?, montant=?, mode_paiement=?, note=? WHERE id=?',
      [statut, montant, mode_paiement, note, req.params.id]
    );
    res.json({ success: true, message: 'Cotisation mise à jour' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};