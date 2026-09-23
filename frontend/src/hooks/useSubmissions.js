import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useSubmissions = (track = 'All', search = '') => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/submissions/gallery', {
        params: { track: track !== 'All' ? track : undefined, search: search || undefined }
      });
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [track, search]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return { submissions, loading, error, refetch: fetchSubmissions };
};
