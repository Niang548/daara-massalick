import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMonProfil, modifierMonProfil } from '../services/api';

const MembreModifierProfil = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: '', nom: '', telephone: '', email: '',
    adresse: '', contact_urgence: '', date_naissance: '', niveau_coranique: ''
  });
  const [chargementPage, setChargementPage] = useState(true);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getMonProfil();
        const p = res.data.data;
        setForm({
          prenom: p.prenom || '',
          nom: p.nom || '',
          telephone: p.telephone || '',
          email: p.email || '',
          adresse: p.adresse || '',
          contact_urgence: p.contact_urgence || '',
          date_naissance: p.date_naissance ? p.date_naissance.split('T')[0] : '',
          niveau_coranique: p.niveau_coranique || ''
        });
      } catch (err) {
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setChargementPage(false);
      }
    };
    charger();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.telephone) {
      toast.error('Prénom, nom et téléphone sont obligatoires');
      return;
    }
    setChargement(true);
    try {
      await modifierMonProfil(form);
      toast.success('Profil mis à jour avec succès');
      navigate('/membre');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setChargement(false);
    }
  };

  if (chargementPage) {
    return <div className="loader">Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>✏️ Modifier mes informations</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Prénom *</label>
              <input
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
              />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>
            <div className="form-group">
              <label>Téléphone *</label>
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="+221 XX XXX XX XX"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
              />
            </div>
            <div className="form-group">
              <label>Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={form.date_naissance}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Niveau coranique</label>
              <select name="niveau_coranique" value={form.niveau_coranique} onChange={handleChange}>
                <option value="">Sélectionner</option>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
                <option value="hafiz">Hafiz</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Adresse</label>
              <input
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Quartier, ville"
              />
            </div>
            <div className="form-group full-width">
              <label>Contact d'urgence</label>
              <input
                name="contact_urgence"
                value={form.contact_urgence}
                onChange={handleChange}
                placeholder="Nom et téléphone d'un proche"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/membre')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={chargement}>
              {chargement ? 'Enregistrement...' : '✅ Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembreModifierProfil;