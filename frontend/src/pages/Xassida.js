import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getXassida, ajouterXassida, supprimerXassida } from '../services/api';

const Xassida = () => {
  const [liste, setListe]       = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    titre: '', auteur: '', description: '',
    categorie: '', langue: 'arabe'
  });
  const [fichiers, setFichiers] = useState({ pdf: null, audio: null });

  const charger = async () => {
    try {
      const res = await getXassida();
      setListe(res.data.data);
    } catch { toast.error('Erreur de chargement'); }
  };

  useEffect(() => { charger(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (fichiers.pdf)   data.append('pdf',   fichiers.pdf);
    if (fichiers.audio) data.append('audio', fichiers.audio);

    try {
      await ajouterXassida(data);
      toast.success('Xassida ajouté avec succès !');
      setShowModal(false);
      setForm({ titre: '', auteur: '', description: '', categorie: '', langue: 'arabe' });
      setFichiers({ pdf: null, audio: null });
      charger();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleSupprimer = async (id, titre) => {
    if (!window.confirm(`Supprimer "${titre}" ?`)) return;
    try {
      await supprimerXassida(id);
      toast.success('Xassida supprimé');
      charger();
    } catch { toast.error('Erreur'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📚 Bibliothèque Xassida</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Ajouter un Xassida
        </button>
      </div>

      {liste.length === 0 ? (
        <div className="card"><div className="empty-state"><p>Aucun xassida ajouté pour l'instant</p></div></div>
      ) : (
        <div className="book-grid">
          {liste.map((x) => (
            <div key={x.id} className="book-card">
              <div className="book-icon">📖</div>
              <h4>{x.titre}</h4>
              <p>{x.auteur || 'Auteur inconnu'}</p>
              <p style={{ fontSize: 11 }}>{x.langue} — {x.categorie || 'Sans catégorie'}</p>
              <div className="book-actions">
                {x.fichier_pdf && (
                  <a href={`http://localhost:5000${x.fichier_pdf}`}
                    target="_blank" rel="noreferrer"
                    className="btn btn-secondary btn-sm">📄 PDF</a>
                )}
                {x.fichier_audio && (
                  <a href={`http://localhost:5000${x.fichier_audio}`}
                    target="_blank" rel="noreferrer"
                    className="btn btn-secondary btn-sm">🎵 Audio</a>
                )}
                <button className="btn btn-danger btn-sm"
                  onClick={() => handleSupprimer(x.id, x.titre)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un Xassida</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Titre *</label>
                  <input value={form.titre} required
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    placeholder="Ex: Matlabul Fawzaini" />
                </div>
                <div className="form-group">
                  <label>Auteur</label>
                  <input value={form.auteur}
                    onChange={(e) => setForm({ ...form, auteur: e.target.value })}
                    placeholder="Ex: Cheikh Ahmadou Bamba" />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <input value={form.categorie}
                    onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                    placeholder="Ex: Poésie, Prière..." />
                </div>
                <div className="form-group full-width">
                  <label>Langue</label>
                  <select value={form.langue}
                    onChange={(e) => setForm({ ...form, langue: e.target.value })}>
                    <option value="arabe">Arabe</option>
                    <option value="wolof">Wolof</option>
                    <option value="francais">Français</option>
                    <option value="pulaar">Pulaar</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows={3} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Description du contenu..." />
                </div>
                <div className="form-group">
                  <label>Fichier PDF</label>
                  <input type="file" accept=".pdf"
                    onChange={(e) => setFichiers({ ...fichiers, pdf: e.target.files[0] })} />
                </div>
                <div className="form-group">
                  <label>Fichier Audio</label>
                  <input type="file" accept="audio/*"
                    onChange={(e) => setFichiers({ ...fichiers, audio: e.target.files[0] })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">✅ Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Xassida;