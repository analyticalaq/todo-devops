const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET - Sare todos lao
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Naya todo banao
router.post('/', async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Todo update karo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Todo delete karo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;