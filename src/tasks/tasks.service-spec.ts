import { find, findAll, create, update, remove, clear, taskDatabaseSize } from './tasks.service';
import { Task, roundSeconds } from './task.interface';

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

    it('ensure creating one task works', async () => {
        const task: Task = await create(testTask);
        // @ts-expect-error
        delete task.id;
        expect(JSON.stringify(task)).toBe(JSON.stringify(testTask));
    });

    it('create anoher task and have two', async () => {
        await create(testTask);
        expect((await findAll()).length).toBe(2);
    });

    it(`expect ${taskDatabaseSize} tasks to be the limit`, async () => {
        clear();
        for (let i = 0; i < taskDatabaseSize; i++) await create(testTask);
        let err = false;
        try {
            await create(testTask);
        } catch {
            err = true;
        }
        expect(err).toBeTrue();
        expect((await findAll()).length).toBe(taskDatabaseSize);
    });

    it('find and update a task', async () => {
        const allTasks: Task[] = await findAll();
        expect(JSON.stringify(allTasks[0]) === JSON.stringify(allTasks[1])).toBeFalse();
        let task = allTasks[1];
        let id = task.id;
        expect(JSON.stringify(task) === JSON.stringify(allTasks[1])).toBeTrue();
        task = await find(id);
        expect(JSON.stringify(task) === JSON.stringify(allTasks[1])).toBeTrue();
        task.name = 'Some other name';
        // @ts-expect-error
        delete task.id;
        update(id, task);
        task.id = id;
        let task1: Task = await find(id);
        expect(JSON.stringify(task) === JSON.stringify(task1)).toBeTrue();
    });

    it('delete and clear', async () => {
        let cnt: number = (await findAll()).length;
        let anId: number = (await findAll())[1].id;
        await remove(anId);
        expect((await findAll()).length).toBe(cnt - 1);
        await clear();
        expect((await findAll()).length).toBe(0);
    });
});
