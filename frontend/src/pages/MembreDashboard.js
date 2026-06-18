import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembreAuth } from '../context/MembreAuthContext';

const MembreDashboard = () => {
  const { membre, deconnexionMembre } = useMembreAuth();
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    deconnexionMembre();
    navigate('/membre/login');
  };

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
          <button className="btn btn-secondary" onClick={handleDeconnexion}>
            🚪 Déconnexion
          </button>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="stat-card">
            <div className="stat-label">Statut</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{membre?.statut}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Mes cotisations</div>
            <div className="stat-value" style={{ fontSize: 18 }}>Bientôt disponible</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembreDashboard;