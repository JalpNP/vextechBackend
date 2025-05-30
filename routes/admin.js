// routes/admin.js
import express from 'express';
const router = express.Router();

const ADMIN_USERNAME = '123';
const ADMIN_PASSWORD = '123';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

export default router;
