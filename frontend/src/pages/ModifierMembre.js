import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMembreById, modifierMembre } from '../services/api';

const ModifierMembre = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    prenom: '', nom: '', telephone: '', email: '',
    adresse: '', statut: 'membre', niveau_coranique: ''
  });
  const [chargementPage, setChargementPage] = useState(true);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getMembreById(id);
        const m = res.data.data;
        setForm({
          prenom: m.prenom || '',
          nom: m.nom || '',
          telephone: m.telephone || '',
          email: m.email || '',
          adresse: m.adresse || '',
          statut: m.statut || 'membre',
          niveau_coranique: m.niveau_coranique || ''
        });
      } catch (err) {
        toast.error('Membre introuvable');
        navigate('/membres');
      } finally {
        setChargementPage(false);
      }
    };
    charger();
  }, [id, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      await modifierMembre(id, form);
      toast.success('Membre modifié avec succès');
      navigate('/membres');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification');
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
        <h1>✏️ Modifier le membre</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Prénom *</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input name="nom" value={form.nom} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Téléphone *</label>
              <input name="telephone" value={form.telephone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select name="statut" value={form.statut} onChange={handleChange}>
                <option value="membre">Membre</option>
                <option value="sympathisant">Sympathisant</option>
              </select>
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
              <input name="adresse" value={form.adresse} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/membres')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={chargement}>
              {chargement ? 'Enregistrement...' : '✅ Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierMembre;