const express = require("express");
const router = express.Router();
const User = require("../module/usermodule.js");
const bcrypt = require("bcryptjs");

// CREATE
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
router.get("/", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { name, email, phone, password } = req.body;

  let updateData = { name, email, phone };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  ).select("-password");

  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User Deleted" });
});

module.exports = router;