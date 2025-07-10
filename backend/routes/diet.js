const express = require('express');
const router = express.Router();
const { parseDietInput } = require('../utils/parseDiet');

router.post('/', async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input provided.' });
  }

  try {
    const parsed = await parseDietInput(input);
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Parsing failed.' });
  }
});

module.exports = router;
