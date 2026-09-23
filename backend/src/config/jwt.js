module.exports = {
  secret: process.env.JWT_SECRET || 'raptors-offline-cryptographic-master-key-2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshSecret: process.env.REFRESH_SECRET || 'raptors-refresh-token-secret-salt-2026',
  refreshExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d'
};
