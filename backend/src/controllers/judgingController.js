const Score = require('../models/Score');
const JudgeAssignment = require('../models/JudgeAssignment');
const Submission = require('../models/Submission');
const AuditLog = require('../models/AuditLog');

// @desc    Get assigned submissions for the logged in judge
// @route   GET /api/v1/judging/assigned
// @access  Judge
exports.getAssignedSubmissions = async (req, res, next) => {
  try {
    const assignments = await JudgeAssignment.find({ judgeId: req.user._id })
      .populate({
        path: 'submissionId',
        select: 'title tagline track repoUrl demoUrl descriptionMarkdown thumbnailPath status'
      });

    // Also fetch any existing scores submitted by this judge to attach status
    const scores = await Score.find({ judgeId: req.user._id });
    const scoreMap = new Map(scores.map(s => [s.submissionId.toString(), s]));

    const responseData = assignments.map(a => {
      const sub = a.submissionId;
      const score = sub ? scoreMap.get(sub._id.toString()) : null;
      return {
        assignmentId: a._id,
        track: a.track,
        status: score ? 'scored' : a.status,
        submission: sub,
        score: score ? {
          totalRawScore: score.totalRawScore,
          criteriaScores: score.criteriaScores,
          privateNotes: score.privateNotes
        } : null
      };
    });

    res.status(200).json({ success: true, count: responseData.length, assignments: responseData });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit or update score ballot for an assigned submission
// @route   POST /api/v1/judging/scores
// @access  Judge
exports.submitScore = async (req, res, next) => {
  try {
    const { submissionId, criteriaScores, privateNotes } = req.body;

    if (!submissionId || !criteriaScores || !Array.isArray(criteriaScores)) {
      return res.status(400).json({ error: 'submissionId and criteriaScores array are required.' });
    }

    // Calculate weighted total score
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const c of criteriaScores) {
      totalWeightedScore += c.rawScore * c.weight;
      totalWeight += c.weight;
    }

    const totalRawScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

    const score = await Score.findOneAndUpdate(
      { judgeId: req.user._id, submissionId },
      {
        judgeId: req.user._id,
        submissionId,
        criteriaScores,
        totalRawScore: Number(totalRawScore.toFixed(2)),
        privateNotes: privateNotes || '',
        isFinal: true
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Update assignment status
    await JudgeAssignment.findOneAndUpdate(
      { judgeId: req.user._id, submissionId },
      { status: 'completed' }
    );

    // Write to audit log
    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'SCORE_SUBMITTED',
      targetResource: 'Score',
      resourceId: score._id,
      payload: { submissionId, totalRawScore },
      ipHash: req.ip || '127.0.0.1'
    });

    res.status(201).json({ success: true, score });
  } catch (err) {
    next(err);
  }
};

// @desc    Get isolated score ballot by scoreId
// @route   GET /api/v1/judging/scores/:scoreId
// @access  Judge (Owner) / Organizer / Admin
exports.getScoreById = async (req, res, next) => {
  try {
    // req.score is populated and verified by isolationGuard
    res.status(200).json({ success: true, score: req.score });
  } catch (err) {
    next(err);
  }
};
