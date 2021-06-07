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
tasksRouter.param('id', (req: Request, res: Response, next) => {
    next();
});

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
    try {
        const id: number = parseInt(req.params.id, 10);
        const task: Task = await TaskService.find(id);
        return res.status(200).send(task);
    } catch (e) {
        res.status(e instanceof ReferenceError ? 404 : 500).send(e.message);
    }
});

// POST tasks
tasksRouter.post('/', async (req: Request, res: Response) => {
    try {
        const task: BaseTask = req.body;
        const newTask = await TaskService.create(task);
        res.status(201).json(newTask);
    } catch (e) {
        res.status(e instanceof TypeError ? 400 : 500).send(e.message);
    }
});

// PUT tasks/:id
tasksRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const updatedTask = await TaskService.update(id, req.body);
        return res.status(200).json(updatedTask);
    } catch (e) {
        let returnCode = 500;
        if (e instanceof ReferenceError) returnCode = 404;
        if (e instanceof TypeError) returnCode = 400;
        return res.status(returnCode).send(e.message);
    }
});

// DELETE tasks/:id
tasksRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await TaskService.remove(id);
        res.sendStatus(204);
    } catch (e) {
        res.status(e instanceof ReferenceError ? 404 : 500).send(e.message);
    }
});
