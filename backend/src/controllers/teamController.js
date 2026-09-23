const Team = require('../models/Team');
const User = require('../models/User');
const crypto = require('crypto');

// Generate 6-char uppercase alphanumeric join code
const generateJoinCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// @desc    Create a new team
// @route   POST /api/v1/teams
// @access  Participant
exports.createTeam = async (req, res, next) => {
  try {
    const { name, track } = req.body;

    if (req.user.teamId) {
      return res.status(400).json({ error: 'You are already a member of a team.' });
    }

    const joinCode = generateJoinCode();

    const team = await Team.create({
      name,
      joinCode,
      captainId: req.user._id,
      members: [req.user._id],
      track
    });

    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.status(201).json({
      success: true,
      team
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Join existing team via join code
// @route   POST /api/v1/teams/join
// @access  Participant
exports.joinTeam = async (req, res, next) => {
  try {
    const { joinCode } = req.body;

    if (req.user.teamId) {
      return res.status(400).json({ error: 'You are already a member of a team.' });
    }

    const team = await Team.findOne({ joinCode: joinCode.trim().toUpperCase() });
    if (!team) {
      return res.status(404).json({ error: 'Invalid join code. Team not found.' });
    }

    if (team.members.length >= 4) {
      return res.status(400).json({ error: 'Team is already full (maximum 4 members).' });
    }

    team.members.push(req.user._id);
    await team.save();

    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.status(200).json({
      success: true,
      message: `Successfully joined ${team.name}`,
      team
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user team & submission status
// @route   GET /api/v1/teams/my-team
// @access  Participant
exports.getMyTeam = async (req, res, next) => {
  try {
    if (!req.user.teamId) {
      return res.status(404).json({ error: 'You do not belong to any team.' });
    }

    const team = await Team.findById(req.user.teamId)
      .populate('members', 'fullName email')
      .populate('captainId', 'fullName email');

    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    res.status(200).json({
      success: true,
      team
    });
  } catch (err) {
    next(err);
  }
};
