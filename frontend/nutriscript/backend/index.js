const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/diet', (req, res) => {
  const { note } = req.body;

  // Mock parser logic
  const parsed = {
    diet_type: "low-sodium, Mediterranean",
    excluded_foods: ["processed snacks", "red meat"],
    preferred_foods: ["leafy greens", "whole grains"],
    tags: ["plant-based", "heart healthy", "high fiber"]
  };

  res.json(parsed);
});

app.listen(PORT, () => {
  console.log();
});
