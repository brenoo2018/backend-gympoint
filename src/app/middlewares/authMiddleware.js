const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authConfig = require('../../config/authConfig');

module.exports = async (req, res, next) => {
  const authHeader = req.params.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não encontrado' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};