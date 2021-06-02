/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from 'express';
import * as TaskService from './tasks.service';
import { BaseTask, Task } from './task.interface';

/**
 * Router Definition
 */
export const tasksRouter = express.Router();

/**
 * Controller Definitions
 */

// GET tasks
tasksRouter.get('/', async (req: Request, res: Response) => {
    try {
        const tasks: Task[] = await TaskService.findAll();

        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// GET tasks/:id
tasksRouter.get('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const task: Task = await TaskService.find(id);

        if (task) {
            return res.status(200).send(task);
        }

        res.status(404).send('task not found');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// POST tasks
tasksRouter.post('/', async (req: Request, res: Response) => {
    try {
        const task: BaseTask = req.body;

        const newTask = await TaskService.create(task);

        res.status(201).json(newTask);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// PUT tasks/:id
tasksRouter.put('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const taskUpdate: Task = req.body;

        const existingTask: Task = await TaskService.find(id);

        if (existingTask) {
            const updatedTask = await TaskService.update(id, taskUpdate);
            return res.status(200).json(updatedTask);
        }

        const newTask = await TaskService.create(taskUpdate);

        res.status(201).json(newTask);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// DELETE tasks/:id
tasksRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await TaskService.remove(id);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});
