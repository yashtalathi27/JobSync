const express = require("express");
const connectDB = require("./config/dbConnection");
const { PORT } = require("./config/dotenv");
const freelancerRoutes = require("./Routes/freelancerRoutes");
const cors = require("cors");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/freelancer", freelancerRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
