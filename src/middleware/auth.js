const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided or invalid format.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = verified;
    next();
  } catch (err) {
    console.error('[Auth Error]', err.message);
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = auth;
