const express = require('express');
const ProgressLog = require('../models/ProgressLog');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /progress/summary/:userId  — last 10 entries
router.get('/summary/:userId', auth, async (req, res) => {
  try {
    const tokenUserId = req.user.id || req.user.sub || req.user._id || req.user.userId;
    if (tokenUserId && String(tokenUserId) !== String(req.params.userId)) {
      return res.status(403).json({ message: 'Unauthorized to access these logs.' });
    }

    const logs = await ProgressLog.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(10);
    res.json(logs);
  } catch (err) { 
    console.error('[Progress summary]', err.message);
    res.status(500).json({ message: 'An internal server error occurred.' }); 
  }
});

// POST /progress/log  — log new progress entry + push Redis event
router.post('/log', auth, async (req, res) => {
  try {
    const tokenUserId = req.user.id || req.user.sub || req.user._id || req.user.userId;
    const logData = { ...req.body, userId: tokenUserId || req.body.userId };
    
    const log = await ProgressLog.create(logData);

    // Dispatch the Redis event
    req.app?.locals?.redis?.publish('progress-updates', JSON.stringify(log));

    res.status(201).json(log);
  } catch (err) { 
    console.error('[Progress log]', err.message);
    res.status(500).json({ message: 'An internal server error occurred.' }); 
  }
});

module.exports = router;
