require('dotenv').config();
const express = require("express");
const router = express.Router();


router.post("/AdminLogin", (req, res) => {
  const { email, password } = req.body;

  // if (email === "admin@example.com" && password === "admin123") {
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    
    return res.json({ success: true, message: "Logged in" });
  } else {
    return res.json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;
