import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMembresEnAttente, validerMembre, rejeterMembre } from '../services/api';

const MembresEnAttente = () => {
  const [liste, setListe] = useState([]);
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    setChargement(true);
    try {
      const res = await getMembresEnAttente();
      setListe(res.data.data);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const handleValider = async (id, nom) => {
    if (!window.confirm(`Valider l'inscription de ${nom} ?`)) return;
    try {
      await validerMembre(id);
      toast.success('Membre validé avec succès');
      charger();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleRejeter = async (id, nom) => {
    if (!window.confirm(`Rejeter et supprimer la demande de ${nom} ?`)) return;
    try {
      await rejeterMembre(id);
      toast.success('Demande rejetée');
      charger();
    } catch {
      toast.error('Erreur');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📥 Demandes d'inscription en attente</h1>
      </div>

      <div className="card">
        {chargement ? (
          <div className="loader">Chargement...</div>
        ) : liste.length === 0 ? (
          <div className="empty-state"><p>Aucune demande en attente</p></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>Statut souhaité</th>
                  <th>Demande envoyée le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {liste.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 500 }}>{m.prenom} {m.nom}</td>
                    <td>{m.telephone}</td>
                    <td>{m.email || '—'}</td>
                    <td><span className="badge badge-blue">{m.statut}</span></td>
                    <td>{new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => handleValider(m.id, `${m.prenom} ${m.nom}`)}>
                          ✅ Valider
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleRejeter(m.id, `${m.prenom} ${m.nom}`)}>
                          ❌ Rejeter
                        </button>
                      </div>
                    </td>
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

export default MembresEnAttente;