import express from 'express';
import mongoose from 'mongoose';
import Task from '../../models/tasks.js';

const router = express.Router();

// Middleware to get task by ID
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.task = task;
    next();
}

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get task by ID
router.get('/:id', getTask, (req, res) => {
    res.json(res.task);
});

// Create task
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        completed: req.body.completed,
        completionDate: req.body.completionDate,
        timeToComplete: req.body.timeToComplete,
        createdAt: req.body.createdAt,
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task
router.patch('/:id', getTask, async (req, res) => {
    if (req.body.title != null) {
        res.task.title = req.body.title;
    }
    if (req.body.description != null) {
        res.task.description = req.body.description;
    }
    if (req.body.dueDate != null) {
        res.task.dueDate = req.body.dueDate;
    }
    if (req.body.priority != null) {
        res.task.priority = req.body.priority;
    }
    if (req.body.status != null) {
        res.task.status = req.body.status;
    }

    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        console.log(`Deleting task with ID: ${req.params.id}`);

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        // Find and delete the task
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Cannot find task' });
        }

        console.log(`Deleted task: ${deletedTask}`);
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
    
    );


export default router;
