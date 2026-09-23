const axios = require('axios');

const FASTAPI_URL = process.env.JUDGING_SERVICE_URL || 'http://localhost:8000';

exports.normalizeScores = async (scores) => {
  const payload = {
    scores: scores.map(s => ({
      score_id: s._id.toString(),
      judge_id: s.judgeId.toString(),
      submission_id: s.submissionId.toString(),
      raw_score: s.totalRawScore
    }))
  };

  try {
    const response = await axios.post(`${FASTAPI_URL}/api/v1/normalize`, payload, {
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.warn(`[FastAPI Client] Normalization fallback: ${error.message}`);
    // Safe offline fallback: min-max / standard 10x scaling if FastAPI is unreachable
    return {
      success: true,
      fallback: true,
      normalized_scores: scores.map(s => ({
        score_id: s._id.toString(),
        normalized_score: Number((s.totalRawScore * 10).toFixed(2))
      }))
    };
  }
};
