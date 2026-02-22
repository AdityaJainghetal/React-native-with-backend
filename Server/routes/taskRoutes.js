const express = require("express");
const router = express.Router();
const Task = require("../module/Taskmodule.js");

// CREATE TASK (Assign Task)
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
    console.log("Task Created:", task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL TASKS
router.get("/", async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
});

// GET TASKS BY USER
router.get("/user/:userId", async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.params.userId });
  res.json(tasks);
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;