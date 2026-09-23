/**
 * Formats dates, numbers, and join codes
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatScore = (num) => {
  if (num === null || num === undefined) return '-';
  return Number(num).toFixed(1);
};
