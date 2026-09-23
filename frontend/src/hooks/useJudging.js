import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useJudging = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/judging/assigned');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const submitScore = async (submissionId, criteriaScores, privateNotes) => {
    const res = await api.post('/judging/scores', {
      submissionId,
      criteriaScores,
      privateNotes
    });
    await fetchAssignments();
    return res.data;
  };

  return { assignments, loading, error, submitScore, refetch: fetchAssignments };
};
