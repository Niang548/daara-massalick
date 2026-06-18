import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAnnonces, creerAnnonce, supprimerAnnonce } from '../services/api';

const Annonces = () => {
  const [annonces, setAnnonces]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    titre: '', contenu: '', date_evenement: '', lieu: '', priorite: 'normale'
  });

  const charger = async () => {
    try {
      const res = await getAnnonces();
      setAnnonces(res.data.data);
    } catch { toast.error('Erreur de chargement'); }
  };

  useEffect(() => { charger(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await creerAnnonce(form);
      toast.success('Annonce publiée !');
      setShowModal(false);
      setForm({ titre: '', contenu: '', date_evenement: '', lieu: '', priorite: 'normale' });
      charger();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Archiver cette annonce ?')) return;
    try {
      await supprimerAnnonce(id);
      toast.success('Annonce archivée');
      charger();
    } catch { toast.error('Erreur'); }
  };

  const prioriteBadge = (p) => {
    if (p === 'urgente')    return <span className="badge badge-red">Urgente</span>;
    if (p === 'importante') return <span className="badge badge-amber">Importante</span>;
    return <span className="badge badge-gray">Normale</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>📢 Annonces & Événements</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Publier une annonce
        </button>
      </div>

      {annonces.length === 0 ? (
        <div className="card"><div className="empty-state"><p>Aucune annonce publiée</p></div></div>
      ) : (
        annonces.map((a) => (
          <div key={a.id} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
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
                  <span>Publié le {new Date(a.date_publication).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <button className="btn btn-danger btn-sm"
                onClick={() => handleSupprimer(a.id)}>
                Archiver
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Publier une annonce</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Titre *</label>
                  <input value={form.titre} required
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    placeholder="Ex: Grand Zikr mensuel" />
                </div>
                <div className="form-group">
                  <label>Date de l'événement</label>
                  <input type="date" value={form.date_evenement}
                    onChange={(e) => setForm({ ...form, date_evenement: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input value={form.lieu}
                    onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                    placeholder="Ex: Thiès, Grande Mosquée" />
                </div>
                <div className="form-group full-width">
                  <label>Priorité</label>
                  <select value={form.priorite}
                    onChange={(e) => setForm({ ...form, priorite: e.target.value })}>
                    <option value="normale">Normale</option>
                    <option value="importante">Importante</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Contenu</label>
                  <textarea rows={4} value={form.contenu}
                    onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                    placeholder="Détails de l'annonce..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">📢 Publier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Annonces;