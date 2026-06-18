const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mediaController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
});

router.get('/',       ctrl.getTousMedias);
router.post('/',      upload.single('fichier'), ctrl.ajouterMedia);
router.delete('/:id', ctrl.supprimerMedia);

module.exports = router;