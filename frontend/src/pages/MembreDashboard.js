import React, { useState, useEffect } from 'react';
import { useMembreAuth } from '../context/MembreAuthContext';
import { getMesCotisations, getMonProfil } from '../services/api';

const MembreDashboard = () => {
  const { membre } = useMembreAuth();

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

  const statutBadge = (s) => {
    if (s === 'paye')   return <span className="badge badge-green">Payé</span>;
    if (s === 'retard') return <span className="badge badge-red">Retard</span>;
    return <span className="badge badge-gray">Exempté</span>;
  };

  if (chargement) {
    return <div className="loader">Chargement...</div>;
  }

  return (
    <div>
      {/* ── Bannière ── */}
      <div style={{
        backgroundImage: 'url(/bg-dashboard.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '16px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '160px',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(26,71,42,0.92) 0%, rgba(26,71,42,0.3) 100%)',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '24px 28px',
          width: '100%',
        }}>
          <h1 style={{ color: '#f0c040', fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
            Bienvenue, {membre?.prenom} {membre?.nom}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
            Espace membre — Daara Massalick
          </p>
        </div>
      </div>

      {/* ── Statistiques ── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
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

      {/* ── Mes cotisations ── */}
      <div className="card">
        <div className="card-title">💰 Mes cotisations</div>
        {cotisations.length === 0 ? (
          <div className="empty-state"><p>Aucune cotisation enregistrée pour l'instant</p></div>
        ) : (
          <div className="table-container">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MembreDashboard;