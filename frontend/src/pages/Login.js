import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const [chargement, setChargement] = useState(false);
  const { connexion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      const res = await login(form);
      connexion(res.data.token, res.data.admin);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/bg-login.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
    }}>
      {/* Superposition sombre pour lisibilité */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.55)',
      }} />

      {/* Carte de connexion */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255, 255, 255, 0.96)',
        borderRadius: '20px',
        padding: '44px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/logo.jpg"
            alt="Logo Daara Massalick"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #1a472a',
              marginBottom: '14px',
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#1a472a',
            marginBottom: '4px',
          }}>
            Daara Massalick
          </h1>
          <p style={{ fontSize: '13px', color: '#888' }}>
            Espace administrateur
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@massalick.sn"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={form.mot_de_passe}
              onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={chargement}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            {chargement ? 'Connexion...' : '🔐 Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
          Vous êtes membre du Daara ?{' '}
          <a href="/membre/login" style={{ color: '#1a472a', fontWeight: 600, textDecoration: 'none' }}>
            Accéder à votre espace membre
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;