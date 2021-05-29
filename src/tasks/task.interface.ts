export interface BaseTask {
  name: string;
  description: string;
  dueDate: Date;
  user: number;
}

export interface Task extends BaseTask {
  id: number;
}

export function getDefaultTask(): BaseTask {
  return {
    name: "unnamed task",
    description: "",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    user: -1,
  };
}
