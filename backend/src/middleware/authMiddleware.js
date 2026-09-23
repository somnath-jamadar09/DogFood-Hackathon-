const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/jwt');

module.exports = async (req, res, next) => {
  let token = (req.cookies && req.cookies.jwt) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || secret);
    req.user = await User.findById(decoded.userId).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User record no longer exists.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token signature invalid or expired.' });
  }
};
