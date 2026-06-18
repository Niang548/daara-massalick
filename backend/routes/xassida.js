const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/xassidaController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/',    ctrl.getTousXassida);
router.get('/:id', ctrl.getXassidaById);
router.post('/',   upload.fields([{ name: 'pdf' }, { name: 'audio' }]), ctrl.ajouterXassida);
router.delete('/:id', ctrl.supprimerXassida);

module.exports = router;