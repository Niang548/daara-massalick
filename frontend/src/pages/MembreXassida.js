import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getXassidaMembre } from '../services/api';

const MembreXassida = () => {
  const navigate = useNavigate();
  const [liste, setListe] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getXassidaMembre();
        setListe(res.data.data);
      } catch (err) {
        toast.error('Erreur lors du chargement');
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  if (chargement) {
    return <div className="loader">Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
            📚 Bibliothèque Xassida
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/membre')}>
            ← Retour
          </button>
        </div>

        {liste.length === 0 ? (
          <div className="empty-state"><p>Aucun xassida disponible pour l'instant</p></div>
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
                    
                    <a href={'https://daara-massalick-backend.onrender.com${x.fichier_pdf}'}
                      target="_blank" rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      📄 PDF
                    </a>
                  )}
                  {x.fichier_audio && (
                    
                     <a href={'https://daara-massalick-backend.onrender.com${x.fichier_audio}'}
                      target ="_blank" rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      🎵 Audio
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembreXassida;