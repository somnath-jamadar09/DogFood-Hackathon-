const Submission = require('../models/Submission');
const Team = require('../models/Team');

// @desc    Create or update draft submission
// @route   POST /api/v1/submissions
// @access  Participant
exports.upsertSubmission = async (req, res, next) => {
  try {
    if (!req.user.teamId) {
      return res.status(400).json({ error: 'You must belong to a team to create a submission.' });
    }

    const { title, tagline, track, repoUrl, demoUrl, descriptionMarkdown } = req.body;

    let submission = await Submission.findOne({ teamId: req.user.teamId });

    if (submission && submission.status === 'locked') {
      return res.status(423).json({ error: 'Submission is locked and can no longer be edited.' });
    }

    if (submission) {
      submission.title = title || submission.title;
      submission.tagline = tagline || submission.tagline;
      submission.track = track || submission.track;
      submission.repoUrl = repoUrl || submission.repoUrl;
      submission.demoUrl = demoUrl !== undefined ? demoUrl : submission.demoUrl;
      submission.descriptionMarkdown = descriptionMarkdown || submission.descriptionMarkdown;
      await submission.save();
      return res.status(200).json({ success: true, submission });
    }

    submission = await Submission.create({
      teamId: req.user.teamId,
      title,
      tagline,
      track,
      repoUrl,
      demoUrl: demoUrl || '',
      descriptionMarkdown,
      status: 'draft'
    });

    res.status(201).json({ success: true, submission });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload thumbnail for submission
// @route   POST /api/v1/submissions/upload-thumbnail
// @access  Participant
exports.uploadThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No thumbnail file uploaded.' });
    }

    const thumbnailPath = `/uploads/${req.file.filename}`;

    const submission = await Submission.findOneAndUpdate(
      { teamId: req.user.teamId },
      { thumbnailPath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      thumbnailPath,
      submission
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lock / finalize submission for judging
// @route   POST /api/v1/submissions/finalize
// @access  Participant
exports.finalizeSubmission = async (req, res, next) => {
  try {
    if (!req.user.teamId) {
      return res.status(400).json({ error: 'Team required.' });
    }

    const submission = await Submission.findOne({ teamId: req.user.teamId });
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    submission.status = 'submitted';
    submission.submittedAt = new Date();
    await submission.save();

    await Team.findByIdAndUpdate(req.user.teamId, { hasSubmitted: true });

    res.status(200).json({
      success: true,
      message: 'Submission successfully finalized and queued for judging.',
      submission
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public gallery submissions
// @route   GET /api/v1/submissions/gallery
// @access  Public
exports.getGallery = async (req, res, next) => {
  try {
    const { track, search, sort } = req.query;
    const filter = { status: { $in: ['submitted', 'locked'] } };

    if (track && track !== 'All') {
      filter.track = track;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let query = Submission.find(filter).populate('teamId', 'name members');

    if (sort === 'votes') {
      query = query.sort({ publicVoteCount: -1 });
    } else {
      query = query.sort({ submittedAt: -1 });
    }

    const submissions = await query.exec();
    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (err) {
    next(err);
  }
};
