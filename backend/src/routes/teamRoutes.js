const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);

router.post('/', roleGuard('participant', 'admin'), teamController.createTeam);
router.post('/join', roleGuard('participant', 'admin'), teamController.joinTeam);
router.get('/my-team', roleGuard('participant', 'admin'), teamController.getMyTeam);

module.exports = router;
