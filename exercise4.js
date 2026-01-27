const express = require("express");
const app = express();

app.use(express.json()); // JSON body parse karne ke liye

// Memory me tasks store karenge
let todos = [];
let id = 1;

// ===== CREATE =====
app.post("/todos", (req, res) => {
  const task = req.body.task;
  if (!task) return res.status(400).json({ error: "Task is required" });

  const todo = { id: id++, task };
  todos.push(todo);
  res.status(201).json(todo);
});

// ===== READ ALL =====
app.get("/todos", (req, res) => {
  res.json(todos);
});

// ===== READ SINGLE =====
app.get("/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: "Task not found" });
  res.json(todo);
});

// ===== UPDATE =====
app.put("/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: "Task not found" });

  const task = req.body.task;
  if (!task) return res.status(400).json({ error: "Task is required" });

  todo.task = task;
  res.json(todo);
});

// ===== DELETE =====
app.delete("/todos/:id", (req, res) => {
  const initialLength = todos.length;
  todos = todos.filter(t => t.id != req.params.id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
});

// ===== SERVER START =====
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
