import { typeCast, typeCastConverter_Date } from '../common/typeCast';

// Data Model Interfaces
import { BaseTask, Task, getDefaultTask } from './task.interface';
import { Tasks } from './tasks.interface';

let tasks: Tasks = {};

// Service Methods
export const findAll = async (): Promise<Task[]> => Object.values(tasks);

export const find = async (id: number): Promise<Task> => tasks[id];

export const taskDatabaseSize = 3;
let count = 0;
export const create = async (newTask: BaseTask): Promise<Task> => {
    if (count >= taskDatabaseSize) throw new Error('task data base size exceeded');
    const id = new Date().valueOf() + count++;

    tasks[id] = {
        id,
        ...(typeCast(getDefaultTask(), newTask, {
            dueDate: typeCastConverter_Date
        }) as BaseTask)
    };
    return tasks[id];
};

export const update = async (id: number, taskpdate: BaseTask): Promise<Task | null> => {
    const task = await find(id);

    if (!task) {
        return null;
    }
    tasks[id] = { id, ...taskpdate };
    return tasks[id];
};

export const remove = async (id: number): Promise<null | void> => {
    const task = await find(id);

    if (!task) {
        return null;
    }
    delete tasks[id];
    count--;
};

export const clear = async () => {
    tasks = {};
    count = 0;
};
