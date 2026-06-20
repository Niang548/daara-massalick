const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/membreController');

router.get('/',       ctrl.getTousMembres);
router.get('/:id',    ctrl.getMembreById);
router.post('/',      ctrl.creerMembre);
router.put('/:id',    ctrl.modifierMembre);
router.delete('/:id', ctrl.supprimerMembre);
router.delete('/:id/definitif', ctrl.supprimerMembreDefinitivement);

// Inscription publique
router.post('/inscription-publique', ctrl.inscriptionPublique);
router.get('/en-attente/liste', ctrl.getMembresEnAttente);
router.put('/:id/valider', ctrl.validerMembre);
router.delete('/:id/rejeter', ctrl.rejeterMembre);

module.exports = router;