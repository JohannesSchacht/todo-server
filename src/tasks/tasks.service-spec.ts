import { find, findAll, create, update, remove, clear } from './tasks.service';
import { BaseTask, Task } from './task.interface';

describe('typeCast:', () => {
    const testTask = {
        name: 'Build Todo API',
        description: 'Use Swagger, Postman and Express',
        dueDate: roundSeconds(new Date('2021-05-24T10:51:16.432Z')),
        user: 2
    };

    const jasmineConfiguration = jasmine.getEnv().configuration();
    jasmineConfiguration.random = false;
    jasmine.getEnv().configure(jasmineConfiguration);

    it('Initial task list should be empty', async () => {
        const tasks = await findAll();
        expect(tasks.length).toBe(0);
    });

    it('push one task works', async () => {
        const task: Task = await create(testTask);
        // @ts-expect-error
        delete task.id;
        expect(JSON.stringify(task)).toBe(JSON.stringify(testTask));
    });
});

function roundSeconds(date: Date): Date {
    date.setMinutes(date.getMinutes() + Math.round(date.getSeconds() / 60));
    date.setSeconds(0, 0);
    return date;
}
