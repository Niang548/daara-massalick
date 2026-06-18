import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getMedias, ajouterMedia, supprimerMedia } from '../services/api';

const Medias = () => {
  const [medias, setMedias]       = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filtre, setFiltre]       = useState('');
  const [form, setForm] = useState({
    titre: '', type: 'photo', evenement: '', date_media: ''
  });
  const [fichier, setFichier] = useState(null);

  const charger = useCallback(async () => {
    try {
      const res = await getMedias(filtre ? { type: filtre } : {});
      setMedias(res.data.data);
    } catch {
      toast.error('Erreur de chargement');
    }
  }, [filtre]);

  useEffect(() => { charger(); }, [charger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fichier) { toast.error('Veuillez sélectionner un fichier'); return; }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append('fichier', fichier);

    try {
      await ajouterMedia(data);
      toast.success('Média ajouté avec succès !');
      setShowModal(false);
      setForm({ titre: '', type: 'photo', evenement: '', date_media: '' });
      setFichier(null);
      charger();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer ce média ?')) return;
    try {
      await supprimerMedia(id);
      toast.success('Média supprimé');
      charger();
    } catch {
      toast.error('Erreur');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🖼️ Médiathèque</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Ajouter un média
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['', 'photo', 'video'].map((f) => (
          <button
            key={f}
            className={`btn ${filtre === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFiltre(f)}
          >
            {f === '' ? 'Tous' : f === 'photo' ? '📷 Photos' : '🎬 Vidéos'}
          </button>
        ))}
      </div>

      {medias.length === 0 ? (
        <div className="card">
          <div className="empty-state"><p>Aucun média pour l'instant</p></div>
        </div>
      ) : (
        <div className="media-grid">
          {medias.map((m) => (
            <div key={m.id} className="media-item">
              {m.type === 'photo' ? (
  <img src={`https://daara-massalick-backend.onrender.com${m.url}`} alt={m.titre} />
) : (
  <video controls src={`https://daara-massalick-backend.onrender.com${m.url}`} />
)}
              <div className="media-item-info">
                <p>{m.titre}</p>
                <span>{m.evenement || 'Sans événement'} — {m.type}</span>
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleSupprimer(m.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ajout média */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un média</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Titre *</label>
                  <input
                    value={form.titre} required
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    placeholder="Ex: Gamou 2025"
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Vidéo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date" value={form.date_media}
                    onChange={(e) => setForm({ ...form, date_media: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Événement</label>
                  <input
                    value={form.evenement}
                    onChange={(e) => setForm({ ...form, evenement: e.target.value })}
                    placeholder="Ex: Journée culturelle 2026"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Fichier *</label>
                  <input
                    type="file" accept="image/*,video/*" required
                    onChange={(e) => setFichier(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button" className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  ✅ Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medias;