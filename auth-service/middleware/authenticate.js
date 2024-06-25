// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  // Check if Authorization header is present and format is correct
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token'});
  }

  // Extract token from Authorization header
  const token = authHeader.split(' ')[1];

  // Verify token
  jwt.verify(token, secret, (err, decoded) => {
   
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // Token is valid, attach decoded user information to request object
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
