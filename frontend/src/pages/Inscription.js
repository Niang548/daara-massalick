import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { creerMembre } from '../services/api';
import { useNavigate } from 'react-router-dom';

const champsVides = {
  prenom: '', nom: '', telephone: '', email: '',
  date_naissance: '', sexe: '', adresse: '',
  statut: 'membre', niveau_coranique: '', contact_urgence: ''
};

const Inscription = () => {
  const [form, setForm]         = useState(champsVides);
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.telephone) {
      toast.error('Prénom, nom et téléphone sont obligatoires');
      return;
    }
    setChargement(true);
    try {
      await creerMembre(form);
      toast.success('Membre inscrit avec succès !');
      setForm(champsVides);
      navigate('/membres');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📝 Formulaire d'inscription</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Prénom *</label>
              <input name="prenom" value={form.prenom}
                onChange={handleChange} placeholder="Ex: Ibrahima" required />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input name="nom" value={form.nom}
                onChange={handleChange} placeholder="Ex: Diallo" required />
            </div>
            <div className="form-group">
              <label>Téléphone *</label>
              <input name="telephone" value={form.telephone}
                onChange={handleChange} placeholder="+221 XX XXX XX XX" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="email@exemple.com" />
            </div>
            <div className="form-group">
              <label>Date de naissance</label>
              <input type="date" name="date_naissance" value={form.date_naissance}
                onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Sexe</label>
              <select name="sexe" value={form.sexe} onChange={handleChange}>
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
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
              <input name="adresse" value={form.adresse}
                onChange={handleChange} placeholder="Quartier, Ville" />
            </div>
            <div className="form-group full-width">
              <label>Contact d'urgence</label>
              <input name="contact_urgence" value={form.contact_urgence}
                onChange={handleChange} placeholder="Nom et téléphone d'un proche" />
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary"
              onClick={() => setForm(champsVides)}>
              Réinitialiser
            </button>
            <button type="submit" className="btn btn-primary" disabled={chargement}>
              {chargement ? 'Enregistrement...' : '✅ Inscrire le membre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inscription;