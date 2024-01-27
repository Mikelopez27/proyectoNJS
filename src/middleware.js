const jwt = require('jsonwebtoken');
const blacklist = new Set();

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  const token = authHeader.substring(7);

  if (blacklist.has(token)) {
    return res.status(401).json({ msg: 'Token expirado' });
  }

  try {
    const decoded = jwt.verify(token, 'Stack');
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }

};

module.exports.blacklist = blacklist