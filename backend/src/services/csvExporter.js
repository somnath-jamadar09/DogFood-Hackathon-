const Submission = require('../models/Submission');
const Score = require('../models/Score');

exports.generateTournamentCSV = async () => {
  const submissions = await Submission.find({ status: { $in: ['submitted', 'locked'] } })
    .populate('teamId', 'name');
  const scores = await Score.find();

  const scoreMap = {};
  for (const s of scores) {
    const subId = s.submissionId.toString();
    if (!scoreMap[subId]) scoreMap[subId] = [];
    scoreMap[subId].push(s);
  }

  const rows = [
    ['Rank', 'Submission Title', 'Team Name', 'Track', 'Raw Avg Score', 'Normalized Avg Score', 'Public Votes', 'Ballots Count']
  ];

  const processed = submissions.map(sub => {
    const subScores = scoreMap[sub._id.toString()] || [];
    const count = subScores.length;
    const rawAvg = count > 0 ? subScores.reduce((acc, curr) => acc + curr.totalRawScore, 0) / count : 0;
    const normScores = subScores.filter(s => s.normalizedScore !== null);
    const normAvg = normScores.length > 0
      ? normScores.reduce((acc, curr) => acc + curr.normalizedScore, 0) / normScores.length
      : rawAvg * 10;

    return {
      title: sub.title,
      team: sub.teamId?.name || 'Independent',
      track: sub.track,
      rawAvg: rawAvg.toFixed(2),
      normAvg: normAvg.toFixed(2),
      normNum: normAvg,
      votes: sub.publicVoteCount,
      count
    };
  });

  processed.sort((a, b) => b.normNum - a.normNum);

  processed.forEach((p, idx) => {
    rows.push([
      idx + 1,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.team.replace(/"/g, '""')}"`,
      p.track,
      p.rawAvg,
      p.normAvg,
      p.votes,
      p.count
    ]);
  });

  return rows.map(r => r.join(',')).join('\n');
};
