const User = require('../models/User');
const Submission = require('../models/Submission');
const Score = require('../models/Score');
const JudgeAssignment = require('../models/JudgeAssignment');
const AuditLog = require('../models/AuditLog');
const assignmentSolver = require('../services/assignmentSolver');
const fastApiClient = require('../services/fastApiClient');
const csvExporter = require('../services/csvExporter');

// @desc    Assign judges to submissions using constraint solver
// @route   POST /api/v1/admin/assign-judges
// @access  Organizer / Admin
exports.assignJudges = async (req, res, next) => {
  try {
    const judges = await User.find({ role: 'judge' });
    const submissions = await Submission.find({ status: { $in: ['submitted', 'locked'] } });

    const assignments = await assignmentSolver.solve({ judges, submissions });

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'JUDGES_ASSIGNED',
      targetResource: 'JudgeAssignment',
      resourceId: req.user._id,
      payload: { count: assignments.length },
      ipHash: req.ip || '127.0.0.1'
    });

    res.status(200).json({
      success: true,
      message: `Successfully generated and saved ${assignments.length} judge assignments.`,
      assignmentsCount: assignments.length
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Trigger statistical score normalization via FastAPI
// @route   POST /api/v1/admin/normalize-scores
// @access  Organizer / Admin
exports.normalizeScores = async (req, res, next) => {
  try {
    const scores = await Score.find({ isFinal: true });
    
    if (scores.length === 0) {
      return res.status(400).json({ error: 'No final scores available for normalization.' });
    }

    const normalizedResults = await fastApiClient.normalizeScores(scores);

    // Persist normalized scores back to MongoDB
    for (const item of normalizedResults.normalized_scores || []) {
      await Score.findByIdAndUpdate(item.score_id, {
        normalizedScore: item.normalized_score
      });
    }

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'NORMALIZATION_EXECUTED',
      targetResource: 'Score',
      resourceId: req.user._id,
      payload: { count: normalizedResults.normalized_scores?.length || 0 },
      ipHash: req.ip || '127.0.0.1'
    });

    res.status(200).json({
      success: true,
      results: normalizedResults
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get leaderboard (raw vs normalized)
// @route   GET /api/v1/admin/leaderboard
// @access  Organizer / Admin
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { mode } = req.query; // 'raw' or 'normalized'
    const submissions = await Submission.find({ status: { $in: ['submitted', 'locked'] } })
      .populate('teamId', 'name members track');

    const scores = await Score.find();

    // Group scores by submission
    const scoreMap = {};
    for (const s of scores) {
      const subId = s.submissionId.toString();
      if (!scoreMap[subId]) scoreMap[subId] = [];
      scoreMap[subId].push(s);
    }

    const leaderboard = submissions.map(sub => {
      const subScores = scoreMap[sub._id.toString()] || [];
      const scoreCount = subScores.length;

      const rawAvg = scoreCount > 0
        ? subScores.reduce((acc, curr) => acc + curr.totalRawScore, 0) / scoreCount
        : 0;

      const normScores = subScores.filter(s => s.normalizedScore !== null);
      const normAvg = normScores.length > 0
        ? normScores.reduce((acc, curr) => acc + curr.normalizedScore, 0) / normScores.length
        : rawAvg * 10; // Fallback scaling to 100

      return {
        submissionId: sub._id,
        title: sub.title,
        track: sub.track,
        teamName: sub.teamId?.name || 'Independent',
        scoresCount: scoreCount,
        averageRawScore: Number(rawAvg.toFixed(2)),
        averageNormalizedScore: Number(normAvg.toFixed(2)),
        finalRankScore: mode === 'raw' ? Number(rawAvg.toFixed(2)) : Number(normAvg.toFixed(2))
      };
    });

    leaderboard.sort((a, b) => b.finalRankScore - a.finalRankScore);

    res.status(200).json({
      success: true,
      mode: mode || 'normalized',
      count: leaderboard.length,
      leaderboard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export results as CSV
// @route   GET /api/v1/admin/export/csv
// @access  Organizer / Admin
exports.exportCSV = async (req, res, next) => {
  try {
    const csvData = await csvExporter.generateTournamentCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="dogfood-2026-leaderboard.csv"');
    res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
};
