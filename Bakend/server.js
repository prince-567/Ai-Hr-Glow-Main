
const express = require("express");
const connectDB = require("./config/db"); // db.js import
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // CORS enable
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
