const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);
router.use(roleGuard('organizer', 'admin'));

router.post('/assign-judges', adminController.assignJudges);
router.post('/normalize-scores', adminController.normalizeScores);
router.get('/leaderboard', adminController.getLeaderboard);
router.get('/export/csv', adminController.exportCSV);

module.exports = router;
