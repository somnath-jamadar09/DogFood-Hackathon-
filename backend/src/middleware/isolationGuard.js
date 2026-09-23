const Score = require('../models/Score');
const JudgeAssignment = require('../models/JudgeAssignment');

exports.verifyScoreOwnership = async (req, res, next) => {
  try {
    const { scoreId } = req.params;
    const score = await Score.findById(scoreId);

    if (!score) {
      return res.status(404).json({ error: 'Score ballot not found.' });
    }

    // Organizers and Admins have global audit access
    if (['organizer', 'admin'].includes(req.user.role)) {
      req.score = score;
      return next();
    }

    // Judges can ONLY view their own submitted score ballots
    if (req.user.role === 'judge') {
      if (score.judgeId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          error: "Security Violation: You are strictly prohibited from inspecting other judges' scores." 
        });
      }
      req.score = score;
      return next();
    }

    return res.status(403).json({ error: 'Unauthorized access.' });
  } catch (err) {
    next(err);
  }
};

exports.verifyJudgeQueueAssignment = async (req, res, next) => {
  try {
    const submissionId = req.body.submissionId || req.params.submissionId;

    if (['organizer', 'admin'].includes(req.user.role)) {
      return next();
    }

    const assignment = await JudgeAssignment.findOne({
      judgeId: req.user._id,
      submissionId: submissionId
    });

    if (!assignment) {
      return res.status(403).json({ 
        error: 'Access Denied: This project is not in your assigned evaluation queue.' 
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
