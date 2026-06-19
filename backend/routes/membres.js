const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/membreController');

router.get('/',       ctrl.getTousMembres);
router.get('/:id',    ctrl.getMembreById);
router.post('/',      ctrl.creerMembre);
router.put('/:id',    ctrl.modifierMembre);
router.delete('/:id', ctrl.supprimerMembre);
router.delete('/:id/definitif', ctrl.supprimerMembreDefinitivement);

module.exports = router;