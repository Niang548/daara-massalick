import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembreAuth } from '../context/MembreAuthContext';
import { getMesCotisations, getMonProfil } from '../services/api';

const MembreDashboard = () => {
  const { membre, deconnexionMembre } = useMembreAuth();
  const navigate = useNavigate();

  const [profil, setProfil] = useState(null);
  const [cotisations, setCotisations] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const [p, c] = await Promise.all([getMonProfil(), getMesCotisations()]);
        setProfil(p.data.data);
        setCotisations(c.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const handleDeconnexion = () => {
    deconnexionMembre();
    navigate('/membre/login');
  };

  const statutBadge = (s) => {
    if (s === 'paye')   return <span className="badge badge-green">Payé</span>;
    if (s === 'retard') return <span className="badge badge-red">Retard</span>;
    return <span className="badge badge-gray">Exempté</span>;
  };

  if (chargement) {
    return <div className="loader">Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, color: '#1a472a' }}>
              Bienvenue, {membre?.prenom} {membre?.nom}
            </h1>
            <p style={{ fontSize: 13, color: '#888' }}>{membre?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => navigate('/membre/modifier-profil')}>
              ✏️ Modifier mes infos
            </button>
            <button className="btn btn-secondary" onClick={handleDeconnexion}>
              🚪 Déconnexion
            </button>
          </div>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="stat-card">
            <div className="stat-label">Statut</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{profil?.statut}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Membre depuis</div>
            <div className="stat-value" style={{ fontSize: 18 }}>
              {profil?.date_inscription
                ? new Date(profil.date_inscription).toLocaleDateString('fr-FR')
                : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">💰 Mes cotisations</div>
        {cotisations.length === 0 ? (
          <div className="empty-state"><p>Aucune cotisation enregistrée pour l'instant</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mois</th>
                <th>Montant</th>
                <th>Mode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {cotisations.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</td>
                  <td>{Number(c.montant).toLocaleString('fr-FR')} FCFA</td>
                  <td>{c.mode_paiement}</td>
                  <td>{statutBadge(c.statut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MembreDashboard;