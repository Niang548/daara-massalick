import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginMembre } from '../services/api';
import { useMembreAuth } from '../context/MembreAuthContext';

const MembreLogin = () => {
  const [form, setForm]             = useState({ email: '', mot_de_passe: '' });
  const [chargement, setChargement] = useState(false);
  const { connexionMembre } = useMembreAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      const res = await loginMembre(form);
      connexionMembre(res.data.token, res.data.membre);
      toast.success('Connexion réussie !');
      navigate('/membre');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>⭐ Daara Massalick</h1>
        <p>Espace membre</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={form.mot_de_passe}
              onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={chargement}>
            {chargement ? 'Connexion...' : '🔐 Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
          Vous êtes administrateur ?{' '}
          <a href="/login" style={{ color: '#1a472a', fontWeight: 600, textDecoration: 'none' }}>
            Accéder à l'espace administrateur
          </a>
        </p>
      </div>
    </div>
  );
};

export default MembreLogin;