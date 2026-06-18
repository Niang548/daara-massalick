const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cotisationController');

router.get('/',             ctrl.getToutesCotisations);
router.get('/stats',        ctrl.getStatistiques);
router.get('/membre/:id',   ctrl.getCotisationsParMembre);
router.post('/',            ctrl.enregistrerCotisation);
router.put('/:id',          ctrl.modifierCotisation);

module.exports = router;