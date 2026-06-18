import React, { useState, useEffect } from 'react';
import { getMembres, getStatsCotisations, getAnnonces } from '../services/api';

const Dashboard = () => {
  const [stats, setStats]       = useState({ total_membres: 0, membres_payes: 0, membres_retard: 0, total_collecte: 0 });
  const [membres, setMembres]   = useState([]);
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    const charger = async () => {
      try {
        const [m, s, a] = await Promise.all([
          getMembres(), getStatsCotisations(), getAnnonces()
        ]);
        setMembres(m.data.data.slice(0, 5));
        setStats(s.data.data);
        setAnnonces(a.data.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    charger();
  }, []);

  return (
    <div>

      {/* ── Bannière d'accueil ── */}
      <div style={{
        backgroundImage: 'url(/bg-dashboard.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '16px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        {/* Superposition dégradée */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(26,71,42,0.92) 0%, rgba(26,71,42,0.3) 100%)',
        }} />

        {/* Contenu bannière */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px 32px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/logo.jpg"
              alt="Logo"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #f0c040',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h1 style={{
                color: '#f0c040',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '4px',
              }}>
                Daara Massalick
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
                Tableau de bord — Espace administrateur
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric',
                month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Statistiques ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total membres</div>
          <div className="stat-value">{membres.length || '—'}</div>
          <div className="stat-sub">membres inscrits</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cotisations payées</div>
          <div className="stat-value" style={{ color: '#1a7a3a' }}>
            {stats.membres_payes || 0}
          </div>
          <div className="stat-sub">ce mois-ci</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">En retard</div>
          <div className="stat-value" style={{ color: '#c0392b' }}>
            {stats.membres_retard || 0}
          </div>
          <div className="stat-sub">membres</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total collecté</div>
          <div className="stat-value" style={{ fontSize: '20px' }}>
            {Number(stats.total_collecte || 0).toLocaleString('fr-FR')}
          </div>
          <div className="stat-sub">FCFA ce mois</div>
        </div>
      </div>

      {/* ── Contenu principal ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Derniers membres */}
        <div className="card">
          <div className="card-title">👥 Derniers membres inscrits</div>
          {membres.length === 0 ? (
            <div className="empty-state"><p>Aucun membre pour l'instant</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {membres.map((m) => (
                  <tr key={m.id}>
                    <td>{m.prenom} {m.nom}</td>
                    <td>{m.telephone}</td>
                    <td><span className="badge badge-blue">{m.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Annonces récentes */}
        <div className="card">
          <div className="card-title">📢 Annonces récentes</div>
          {annonces.length === 0 ? (
            <div className="empty-state"><p>Aucune annonce pour l'instant</p></div>
          ) : (
            annonces.map((a) => (
              <div key={a.id} style={{
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{a.titre}</span>
                  <span className={`badge badge-${
                    a.priorite === 'urgente' ? 'red' :
                    a.priorite === 'importante' ? 'amber' : 'gray'
                  }`}>
                    {a.priorite}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {a.date_evenement
                    ? new Date(a.date_evenement).toLocaleDateString('fr-FR')
                    : 'Sans date'} — {a.lieu || 'Lieu non précisé'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;