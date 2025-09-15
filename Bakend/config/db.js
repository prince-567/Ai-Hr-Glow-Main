const mongoose = require("mongoose");

// MongoDB connection URI
const MONGO_URI = "mongodb://localhost:27017/hrms_database"; // apne DB ka naam yahan

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // agar DB connect nahi hota, server stop ho jaye
  }

  // Optional: real-time connection monitoring
  const db = mongoose.connection;
  db.on("error", err => console.error("MongoDB connection error (real-time):", err));
  db.once("open", () => console.log("MongoDB connection is open and ready"));
};

module.exports = connectDB;
