const db = require('../config/database');
const crypto = require('crypto');
const { envoyerEmailCreationCompte } = require('../services/emailService');
exports.getTousMembres = async (req, res) => {
  try {
    const { search, statut } = req.query;
    let query = 'SELECT * FROM membres WHERE actif = TRUE';
    const params = [];

    if (search) {
      query += ' AND (prenom LIKE ? OR nom LIKE ? OR telephone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (statut) {
      query += ' AND statut = ?';
      params.push(statut);
    }
    query += ' ORDER BY created_at DESC';

    const [membres] = await db.query(query, params);
    res.json({ success: true, total: membres.length, data: membres });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMembreById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM membres WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Membre introuvable' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.creerMembre = async (req, res) => {
  try {
    const {
      prenom, nom, telephone, email,
      date_naissance, sexe, adresse,
      statut, niveau_coranique, contact_urgence
    } = req.body;

    if (!prenom || !nom || !telephone)
      return res.status(400).json({
        success: false,
        message: 'Prénom, nom et téléphone sont obligatoires'
      });

    const [result] = await db.query(
      `INSERT INTO membres
       (prenom, nom, telephone, email, date_naissance,
        sexe, adresse, statut, niveau_coranique, contact_urgence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prenom, nom, telephone,
        email || null,
        date_naissance || null,
        sexe || null,
        adresse || null,
        statut || 'membre',
        niveau_coranique || null,
        contact_urgence || null
      ]
    );

    const membreId = result.insertId;

    // Si un email a été fourni, on envoie le lien de création de mot de passe
    if (email) {
      try {
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = new Date(Date.now() + 48 * 60 * 60 * 1000);

        await db.query(
          'UPDATE membres SET token_creation = ?, token_expiration = ? WHERE id = ?',
          [token, expiration, membreId]
        );

        await envoyerEmailCreationCompte(email, prenom, token);
      } catch (emailErr) {
        console.error('Erreur envoi email:', emailErr.message);
        // On continue même si l'email échoue, le membre est déjà créé
      }
    }

    res.status(201).json({
      success: true,
      message: email
        ? 'Membre créé avec succès, un email a été envoyé pour créer son mot de passe'
        : 'Membre créé avec succès (aucun email fourni, pas d\'accès espace membre)',
      id: membreId
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({
        success: false,
        message: 'Ce numéro de téléphone est déjà enregistré'
      });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.modifierMembre = async (req, res) => {
  try {
    const { prenom, nom, telephone, email, adresse, statut, niveau_coranique } = req.body;
    await db.query(
      `UPDATE membres SET prenom=?, nom=?, telephone=?, email=?,
       adresse=?, statut=?, niveau_coranique=? WHERE id=?`,
      [prenom, nom, telephone, email, adresse, statut, niveau_coranique, req.params.id]
    );
    res.json({ success: true, message: 'Membre modifié avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.supprimerMembre = async (req, res) => {
  try {
    await db.query('UPDATE membres SET actif = FALSE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Membre désactivé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};