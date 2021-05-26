/**
 * Data Model Interfaces
 */

import { BaseTask, Task } from "./task.interface";
import { Tasks } from "./tasks.interface";

let tasks: Tasks = {
  1: {
    id: 1,
    name: "Burger",
    price: 599,
    description: "Tasty",
    image: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png",
  },
  2: {
    id: 2,
    name: "Pizza",
    price: 299,
    description: "Cheesy",
    image: "https://cdn.auth0.com/blog/whatabyte/pizza-sm.png",
  },
  3: {
    id: 3,
    name: "Tea",
    price: 199,
    description: "Informative",
    image: "https://cdn.auth0.com/blog/whatabyte/tea-sm.png",
  },
};

/**
 * Service Methods
 */

export const findAll = async (): Promise<Task[]> => Object.values(tasks);

export const find = async (id: number): Promise<Task> => tasks[id];

export const create = async (newTask: BaseTask): Promise<Task> => {
  const id = new Date().valueOf();

  tasks[id] = {
    id,
    ...newTask,
  };
  return tasks[id];
};

export const update = async (
  id: number,
  taskpdate: BaseTask
): Promise<Task | null> => {
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
};
