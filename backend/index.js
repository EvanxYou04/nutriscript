const express = require("express");
const cors = require("cors");
const dietRoutes = require("./routes/diet");
const { parseDietInput } = require("./utils/parseDiet");

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/diet', async (req, res) => {
    console.log('=== POST /api/diet called ===');
    console.log('Request body:', req.body);

    const { note } = req.body;

    if (!note) {
        return res.status(400).json({ error: 'No note provided.' });
    }

    try {
        const parsed = await parseDietInput(note);
        console.log(parsed);
        res.json(parsed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Parsing failed." });
    }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});