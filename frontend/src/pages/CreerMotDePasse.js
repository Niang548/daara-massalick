import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifierToken, creerMotDePasse } from '../services/api';

const CreerMotDePasse = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [chargementPage, setChargementPage] = useState(true);
  const [tokenValide, setTokenValide]        = useState(false);
  const [infosMembre, setInfosMembre]        = useState(null);

  const [motDePasse, setMotDePasse]         = useState('');
  const [confirmation, setConfirmation]     = useState('');
  const [chargement, setChargement]         = useState(false);

  useEffect(() => {
    const verifier = async () => {
      try {
        const res = await verifierToken(token);
        setInfosMembre(res.data.data);
        setTokenValide(true);
      } catch (err) {
        setTokenValide(false);
      } finally {
        setChargementPage(false);
      }
    };
    verifier();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (motDePasse.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (motDePasse !== confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setChargement(true);
    try {
      await creerMotDePasse(token, { mot_de_passe: motDePasse });
      toast.success('Mot de passe créé avec succès ! Vous pouvez vous connecter.');
      navigate('/membre/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création du mot de passe');
    } finally {
      setChargement(false);
    }
  };

  if (chargementPage) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p style={{ textAlign: 'center' }}>Vérification du lien...</p>
        </div>
      </div>
    );
  }

  if (!tokenValide) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>⚠️ Lien invalide</h1>
          <p>Ce lien a expiré ou n'est plus valide. Contactez l'administration pour recevoir un nouveau lien.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>⭐ Daara Massalick</h1>
        <p>Bonjour {infosMembre?.prenom}, créez votre mot de passe</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="Au moins 6 caractères"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Retapez le mot de passe"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={chargement}>
            {chargement ? 'Création...' : '✅ Créer mon mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreerMotDePasse;