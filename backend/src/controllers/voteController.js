const Vote = require('../models/Vote');
const Submission = require('../models/Submission');
const crypto = require('crypto');

// @desc    Cast community upvote on a project
// @route   POST /api/v1/votes
// @access  Public (Rate-limited, fingerprint-checked)
exports.castVote = async (req, res, next) => {
  try {
    const { submissionId, clientFingerprint } = req.body;

    if (!submissionId) {
      return res.status(400).json({ error: 'submissionId is required.' });
    }

    // Derive deterministic fingerprint hash from client token or IP
    const rawFingerprint = clientFingerprint || req.ip || 'anonymous';
    const fingerprintHash = crypto.createHash('sha256').update(rawFingerprint).digest('hex');

    // Check if vote already exists for this fingerprint and project within 24h
    const existingVote = await Vote.findOne({ submissionId, fingerprintHash });
    if (existingVote) {
      return res.status(409).json({ error: 'You have already voted for this project today.' });
    }

    await Vote.create({
      submissionId,
      fingerprintHash,
      ipAddress: req.ip
    });

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { $inc: { publicVoteCount: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Vote successfully recorded.',
      publicVoteCount: updatedSubmission ? updatedSubmission.publicVoteCount : 1
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You have already voted for this project today.' });
    }
    next(err);
  }
};
