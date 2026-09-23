const JudgeAssignment = require('../models/JudgeAssignment');

/**
 * Greedy Constraint-Satisfied Judge Assignment Engine
 * Balances workload, respects tracks, and prevents conflicts of interest
 */
exports.solve = async ({ judges, submissions }) => {
  // Clear existing assignments if any
  await JudgeAssignment.deleteMany({});

  const assignments = [];
  const judgeWorkload = {};

  // Initialize judge workloads
  for (const j of judges) {
    judgeWorkload[j._id.toString()] = 0;
  }

  // Iterate over each submission and assign eligible judges
  for (const submission of submissions) {
    const targetTrack = submission.track;

    // Filter eligible judges (track match and no conflict)
    const eligibleJudges = judges.filter(j => {
      const hasTrack = !j.judgeTracks || j.judgeTracks.length === 0 || j.judgeTracks.includes(targetTrack);
      const isConflict = j.conflictsOfInterest && j.conflictsOfInterest.some(
        cId => cId.toString() === submission.teamId?.toString()
      );
      return hasTrack && !isConflict;
    });

    // Sort eligible judges by lowest current workload
    eligibleJudges.sort((a, b) => {
      return (judgeWorkload[a._id.toString()] || 0) - (judgeWorkload[b._id.toString()] || 0);
    });

    // Assign top 2 or 3 judges per submission (or all available if fewer)
    const judgesToAssign = eligibleJudges.slice(0, Math.min(3, eligibleJudges.length));

    for (const judge of judgesToAssign) {
      assignments.push({
        judgeId: judge._id,
        submissionId: submission._id,
        track: submission.track,
        status: 'pending'
      });
      judgeWorkload[judge._id.toString()] = (judgeWorkload[judge._id.toString()] || 0) + 1;
    }
  }

  if (assignments.length > 0) {
    await JudgeAssignment.insertMany(assignments);
  }

  return assignments;
};
