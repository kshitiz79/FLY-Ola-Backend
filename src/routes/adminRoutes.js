// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const adminAuth = require("../middleware/adminAuth");

// Register a new admin
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const admin = await Admin.create({ username, email, password });
    res.status(201).json({ message: "Admin registered", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Dummy credentials for testing
    const dummyEmail = 'admin@example.com';
    const dummyPassword = '123456';

    if (email !== dummyEmail || password !== dummyPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: 'dummy-admin-id' }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    res.json({ message: 'Login successful', token, adminId: 'dummy-admin-id' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Protected route: Get admin profile
router.get("/profile", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
