const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const path = require('path');

router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
