const jwt = require('jsonwebtoken');

function generateToken(userId, role) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in environment variables.');
  }

  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = generateToken;
