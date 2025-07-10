const express = require("express");
const cors = require("cors");
const dietRoutes = require("./routes/diet");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/diet/', dietRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});