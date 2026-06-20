import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAnnoncesMembre } from '../services/api';

const MembreAnnonces = () => {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getAnnoncesMembre();
        setAnnonces(res.data.data);
      } catch (err) {
        toast.error('Erreur lors du chargement');
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const prioriteBadge = (p) => {
    if (p === 'urgente')    return <span className="badge badge-red">Urgente</span>;
    if (p === 'importante') return <span className="badge badge-amber">Importante</span>;
    return <span className="badge badge-gray">Normale</span>;
  };

  if (chargement) {
    return <div className="loader">Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, color: '#1a472a' }}>📢 Annonces & Événements</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/membre')}>
          ← Retour
        </button>
      </div>

      {annonces.length === 0 ? (
        <div className="card"><div className="empty-state"><p>Aucune annonce publiée</p></div></div>
      ) : (
        annonces.map((a) => (
          <div key={a.id} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{a.titre}</h3>
              {prioriteBadge(a.priorite)}
            </div>
            <p style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>{a.contenu}</p>
            <div style={{ fontSize: 12, color: '#aaa', display: 'flex', gap: 16 }}>
              {a.date_evenement && (
                <span>📅 {new Date(a.date_evenement).toLocaleDateString('fr-FR')}</span>
              )}
              {a.lieu && <span>📍 {a.lieu}</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MembreAnnonces;