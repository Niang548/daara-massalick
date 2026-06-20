import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMediasMembre } from '../services/api';

const MembreMedias = () => {
  const navigate = useNavigate();
  const [medias, setMedias] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      try {
        const res = await getMediasMembre(filtre ? { type: filtre } : {});
        setMedias(res.data.data);
      } catch (err) {
        toast.error('Erreur lors du chargement');
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [filtre]);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, color: '#1a472a' }}>🖼️ Médiathèque</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/membre')}>
          ← Retour
        </button>
      </div>

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

      {chargement ? (
        <div className="loader">Chargement...</div>
      ) : medias.length === 0 ? (
        <div className="card"><div className="empty-state"><p>Aucun média pour l'instant</p></div></div>
      ) : (
        <div className="media-grid">
          {medias.map((m) => (
            <div key={m.id} className="media-item">
              {m.type === 'photo' ? (
                // eslint-disable-next-line no-template-curly-in-string
                <img src={`https://daara-massalick-backend.onrender.com${m.url}`} alt={m.titre} />
              ) : (
                // eslint-disable-next-line no-template-curly-in-string
                <video controls src={`https://daara-massalick-backend.onrender.com${m.url}`} />
              )}
              <div className="media-item-info">
                <p>{m.titre}</p>
                <span>{m.evenement || 'Sans événement'} — {m.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembreMedias;