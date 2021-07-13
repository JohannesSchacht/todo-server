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

tasksRouter.param('id', paramId);
tasksRouter.get('/', findAll);
tasksRouter.get('/:id', find);
tasksRouter.post('/', create);
tasksRouter.put('/:id', update);
tasksRouter.delete('/:id', remove);

/**
 * Router Implementation
 */
function paramId(req: Request, res: Response, next: () => void) {
    next();
}

async function findAll(req: Request, res: Response) {
    try {
        const tasks: Task[] = await TaskService.findAll();
        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send(e.message);
    }
}

async function find(req: Request, res: Response) {
    try {
        const id: number = parseInt(req.params.id, 10);
        const task: Task = await TaskService.find(id);
        return res.status(200).send(task);
    } catch (e) {
        res.status(e instanceof ReferenceError ? 404 : 500).send(e.message);
    }
}

async function create(req: Request, res: Response) {
    try {
        const task: BaseTask = req.body;
        const newTask = await TaskService.create(task);
        res.status(201).json(newTask);
    } catch (e) {
        res.status(e instanceof TypeError ? 400 : 500).send(e.message);
    }
}

async function update(req: Request, res: Response) {
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
}

async function remove(req: Request, res: Response) {
    try {
        const id: number = parseInt(req.params.id, 10);
        await TaskService.remove(id);
        res.sendStatus(204);
    } catch (e) {
        res.status(e instanceof ReferenceError ? 404 : 500).send(e.message);
    }
}
