export interface BaseTask {
    name?: string;
    description?: string;
    dueDate?: Date;
    user?: number;
}

export interface Task extends BaseTask {
    id: number;
}

export function getDefaultTask(): BaseTask {
    return {
        name: 'unnamed task',
        description: '',
        dueDate: roundSeconds(new Date(Date.now() + 1000 * 60 * 60 * 24)),
        user: -1
    };
}

export function roundSeconds(date: Date): Date {
    date.setMinutes(date.getMinutes() + Math.round(date.getSeconds() / 60));
    date.setSeconds(0, 0);
    return date;
}
