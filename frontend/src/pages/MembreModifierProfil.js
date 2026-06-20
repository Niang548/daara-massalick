import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMonProfil, modifierMonProfil } from '../services/api';

const MembreModifierProfil = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    telephone: '', email: '', adresse: '', contact_urgence: ''
  });
  const [chargementPage, setChargementPage] = useState(true);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getMonProfil();
        const p = res.data.data;
        setForm({
          telephone: p.telephone || '',
          email: p.email || '',
          adresse: p.adresse || '',
          contact_urgence: p.contact_urgence || ''
        });
      } catch (err) {
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setChargementPage(false);
      }
    };
    charger();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      await modifierMonProfil(form);
      toast.success('Profil mis à jour avec succès');
      navigate('/membre');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setChargement(false);
    }
  };

  if (chargementPage) {
    return <div className="loader">Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <div className="card">
        <div className="card-title">✏️ Modifier mes informations</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="form-group">
              <label>Téléphone</label>
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="+221 XX XXX XX XX"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Quartier, ville"
              />
            </div>
            <div className="form-group">
              <label>Contact d'urgence</label>
              <input
                name="contact_urgence"
                value={form.contact_urgence}
                onChange={handleChange}
                placeholder="Nom et téléphone d'un proche"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/membre')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={chargement}>
              {chargement ? 'Enregistrement...' : '✅ Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembreModifierProfil;