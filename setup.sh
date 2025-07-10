#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "📁 Creating project directories..."
mkdir -p nutriscript/{frontend,backend}
cd nutriscript

echo "🚀 Initializing backend..."
cd backend
npm init -y
npm install express cors

# Create backend server file
cat <<EOL > index.js
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
  console.log(`Server running on http://localhost:\${PORT}`);
});
EOL

cd ..

echo "⚡ Setting up frontend with Vite + React..."
npm create vite@latest frontend -- --template react
cd frontend
npm install

echo "🔧 Configuring Vite proxy..."
# Update vite.config.js to include proxy
sed -i.bak '/defineConfig({/a\
  server: {\
    proxy: {\
      "/api": "http://localhost:3001"\
    }\
  },
' vite.config.js

echo "✅ Setup complete!"
echo "To start the backend: cd nutriscript/backend && node index.js"
echo "To start the frontend: cd nutriscript/frontend && npm run dev"
