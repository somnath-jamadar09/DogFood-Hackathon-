const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');
const upload = require('../config/multer');

// Public gallery endpoint
router.get('/gallery', submissionController.getGallery);

// Protected participant endpoints
router.post('/', authMiddleware, roleGuard('participant', 'admin'), submissionController.upsertSubmission);
router.post('/upload-thumbnail', authMiddleware, roleGuard('participant', 'admin'), upload.single('thumbnail'), submissionController.uploadThumbnail);
router.post('/finalize', authMiddleware, roleGuard('participant', 'admin'), submissionController.finalizeSubmission);

module.exports = router;
