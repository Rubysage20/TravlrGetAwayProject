// app_api/routes/index.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

/** JWT auth middleware: expects "Authorization: Bearer <token)" */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Bearer token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token validation error', error: err.message });
    }
    req.auth = decoded; // attach decoded payload for controllers
    next();
  });
}

/* ---------- Auth endpoints (public) ---------- */
router.post('/register', authController.register);
router.post('/login', authController.login);

/* ---------- Trip endpoints ---------- */
// List trips (public), Create trip (protected)
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

// Get one trip (public), Update trip (protected)
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;
