const express = require('express');
const router = express.Router();
const judgingController = require('../controllers/judgingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');
const { verifyJudgeQueueAssignment, verifyScoreOwnership } = require('../middleware/isolationGuard');

router.use(authMiddleware);

router.get('/assigned', roleGuard('judge', 'admin'), judgingController.getAssignedSubmissions);
router.post('/scores', roleGuard('judge', 'admin'), verifyJudgeQueueAssignment, judgingController.submitScore);
router.get('/scores/:scoreId', roleGuard('judge', 'organizer', 'admin'), verifyScoreOwnership, judgingController.getScoreById);

module.exports = router;
