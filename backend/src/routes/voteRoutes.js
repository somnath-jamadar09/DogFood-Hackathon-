const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { voteLimiter } = require('../middleware/rateLimiter');

router.post('/', voteLimiter, voteController.castVote);

module.exports = router;
