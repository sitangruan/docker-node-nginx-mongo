import express from 'express';
import { Task } from '../models/task.js';

export const router = express.Router();

// List
router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// Create
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = await Task.create({ title });
  res.status(201).json(newTask);
});

// Update
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { title, completed },
    { new: true }
  );
  if (!updatedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(updatedTask);
});

// Delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedTask = await Task.findByIdAndDelete(id);
  if (!deletedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).end();
});