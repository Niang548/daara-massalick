import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getCotisations, enregistrerCotisation, getMembres } from '../services/api';

const Cotisations = () => {
  const [cotisations, setCotisations] = useState([]);
  const [membres, setMembres]         = useState([]);
  const [showModal, setShowModal]     = useState(false);
  const [filtre, setFiltre]           = useState({ mois: '', statut: '' });
  const [form, setForm] = useState({
    membre_id: '', montant: 2000, mois: '', mode_paiement: 'especes', note: ''
  });

  const charger = useCallback(async () => {
    try {
      const [c, m] = await Promise.all([
        getCotisations(filtre),
        getMembres()
      ]);
      setCotisations(c.data.data);
      setMembres(m.data.data);
    } catch {
      toast.error('Erreur de chargement');
    }
  }, [filtre]);

  useEffect(() => { charger(); }, [charger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await enregistrerCotisation(form);
      toast.success(`Cotisation enregistrée — Reçu : ${res.data.recu_numero}`);
      setShowModal(false);
      setForm({
        membre_id: '', montant: 2000,
        mois: '', mode_paiement: 'especes', note: ''
      });
      charger();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const statutBadge = (s) => {
    if (s === 'paye')   return <span className="badge badge-green">Payé</span>;
    if (s === 'retard') return <span className="badge badge-red">Retard</span>;
    return <span className="badge badge-gray">Exempté</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>💰 Gestion des cotisations</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Enregistrer un paiement
        </button>
      </div>

      {/* Filtres */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="search-bar">
          <input
            type="month"
            value={filtre.mois}
            onChange={(e) => setFiltre({ ...filtre, mois: e.target.value })}
            style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
          />
          <select
            value={filtre.statut}
            onChange={(e) => setFiltre({ ...filtre, statut: e.target.value })}
          >
            <option value="">Tous les statuts</option>
            <option value="paye">Payé</option>
            <option value="retard">En retard</option>
            <option value="exempte">Exempté</option>
          </select>
          <button className="btn btn-primary" onClick={charger}>Filtrer</button>
        </div>
      </div>

      {/* Tableau */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Membre</th>
                <th>Téléphone</th>
                <th>Montant</th>
                <th>Mois</th>
                <th>Mode</th>
                <th>N° Reçu</th>
                <th>Date paiement</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {cotisations.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>
                    Aucune cotisation trouvée
                  </td>
                </tr>
              ) : (
                cotisations.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.prenom} {c.nom}</td>
                    <td>{c.telephone}</td>
                    <td>{Number(c.montant).toLocaleString('fr-FR')} FCFA</td>
                    <td>
                      {new Date(c.mois).toLocaleDateString('fr-FR', {
                        month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td>{c.mode_paiement}</td>
                    <td style={{ fontSize: 12, color: '#888' }}>{c.recu_numero || '—'}</td>
                    <td>
                      {c.date_paiement
                        ? new Date(c.date_paiement).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td>{statutBadge(c.statut)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal paiement */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enregistrer un paiement</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Membre *</label>
                  <select
                    value={form.membre_id} required
                    onChange={(e) => setForm({ ...form, membre_id: e.target.value })}
                  >
                    <option value="">Sélectionner un membre</option>
                    {membres.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.prenom} {m.nom} — {m.telephone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Montant (FCFA) *</label>
                  <input
                    type="number" value={form.montant} required
                    onChange={(e) => setForm({ ...form, montant: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Mois *</label>
                  <input
                    type="month" required
                    value={form.mois ? form.mois.slice(0, 7) : ''}
                    onChange={(e) =>
                      setForm({ ...form, mois: e.target.value + '-01' })
                    }
                  />
                </div>
                <div className="form-group full-width">
                  <label>Mode de paiement</label>
                  <select
                    value={form.mode_paiement}
                    onChange={(e) => setForm({ ...form, mode_paiement: e.target.value })}
                  >
                    <option value="especes">Espèces</option>
                    <option value="wave">Wave</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="virement">Virement</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Note (optionnel)</label>
                  <textarea
                    value={form.note} rows={2}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Remarque éventuelle..."
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
                  ✅ Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cotisations;