const express = require("express");
const connectDB = require("./config/dbConnection");
const { PORT } = require("./config/dotenv");

const app = express();

// Connect to database
connectDB();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
