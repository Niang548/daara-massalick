import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { envoyerMessageContact } from '../services/api';

const MembreContact = () => {
  const [form, setForm] = useState({ sujet: '', message: '' });
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sujet || !form.message) {
      toast.error('Veuillez remplir le sujet et le message');
      return;
    }
    setChargement(true);
    try {
      await envoyerMessageContact(form);
      toast.success('Votre message a été envoyé à l\'administration');
      setForm({ sujet: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>✉️ Contacter l'administration</h1>
      </div>

      <div className="card">
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          Vous avez une question, une suggestion ou une recommandation ? Envoyez un message directement à l'administration du Daara.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="form-group">
              <label>Sujet *</label>
              <input
                name="sujet"
                value={form.sujet}
                onChange={handleChange}
                placeholder="Ex: Question sur les cotisations"
                required
              />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                placeholder="Écrivez votre message ici..."
                required
              />
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', marginTop: 24, justifyContent: 'flex-start' }}>
            <button type="submit" className="btn btn-primary" disabled={chargement}>
              {chargement ? 'Envoi en cours...' : '📨 Envoyer le message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembreContact;