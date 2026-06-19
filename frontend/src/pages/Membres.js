import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getMembres, supprimerMembre, supprimerMembreDefinitivement } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Membres = () => {
  const [membres, setMembres]       = useState([]);
  const [search, setSearch]         = useState('');
  const [statut, setStatut]         = useState('');
  const [chargement, setChargement] = useState(true);
  const navigate = useNavigate();

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const res = await getMembres({ search, statut });
      setMembres(res.data.data);
    } catch {
      toast.error('Erreur lors du chargement des membres');
    } finally {
      setChargement(false);
    }
  }, [search, statut]);

  useEffect(() => { charger(); }, [charger]);

  const handleDesactiver = async (id, nom) => {
    if (!window.confirm(`Désactiver le membre ${nom} ?\n\nIl restera dans la base de données mais ne sera plus visible dans les listes actives.`)) return;
    try {
      await supprimerMembre(id);
      toast.success('Membre désactivé');
      charger();
    } catch {
      toast.error('Erreur lors de la désactivation');
    }
  };

  const handleSupprimerDefinitif = async (id, nom) => {
    if (!window.confirm(`⚠️ ATTENTION : Supprimer DÉFINITIVEMENT le membre ${nom} ?\n\nCette action est IRRÉVERSIBLE. Toutes ses cotisations seront aussi supprimées.`)) return;
    try {
      await supprimerMembreDefinitivement(id);
      toast.success('Membre supprimé définitivement');
      charger();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>👥 Répertoire des membres</h1>
        <button className="btn btn-primary" onClick={() => navigate('/inscription')}>
          + Nouveau membre
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="membre">Membre</option>
            <option value="sympathisant">Sympathisant</option>
          </select>
          <button className="btn btn-primary" onClick={charger}>Filtrer</button>
        </div>

        {chargement ? (
          <div className="loader">Chargement...</div>
        ) : membres.length === 0 ? (
          <div className="empty-state">
            <p>Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom complet</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Statut</th>
                  <th>Niveau</th>
                  <th>Inscrit le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {membres.map((m, i) => (
                  <tr key={m.id}>
                    <td style={{ color: '#aaa' }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{m.prenom} {m.nom}</td>
                    <td>{m.telephone}</td>
                    <td>{m.adresse || '—'}</td>
                    <td><span className="badge badge-blue">{m.statut}</span></td>
                    <td>{m.niveau_coranique || '—'}</td>
                    <td>
                      {m.date_inscription
                        ? new Date(m.date_inscription).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/membres/${m.id}/modifier`)}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDesactiver(m.id, `${m.prenom} ${m.nom}`)}
                        >
                          Désactiver
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleSupprimerDefinitif(m.id, `${m.prenom} ${m.nom}`)}
                        >
                          🗑️ Supprimer
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

export default Membres;