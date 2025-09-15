const express = require("express");
const User = require("../models/User");

const router = express.Router();


// ------------------ READ (Get all users) ------------------
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ------------------ CREATE (Add single/multiple users) ------------------
router.post("/", async (req, res) => {
  try {
    let data = req.body;

    if (Array.isArray(data)) {
      // Multiple users insert
      const users = await User.insertMany(data);
      res.status(201).json(users);
    } else {
      // Single user insert
      const user = new User(data);
      await user.save();
      res.status(201).json(user);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ------------------ UPDATE (Update user by ID) ------------------
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new:true = return updated doc
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ------------------ DELETE (Delete user by ID) ------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
