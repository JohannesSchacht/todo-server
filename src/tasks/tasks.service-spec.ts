import { find, findAll, create, update, remove, clear, taskDatabaseSize } from './tasks.service';
import { Task, roundSeconds, BaseTask } from './task.interface';

describe('task.services:', () => {
    const testTask: BaseTask = {
        name: 'Build Todo API',
        description: 'Use Swagger, Postman and Express',
        dueDate: roundSeconds(new Date('2021-05-24T10:51:16.432Z')),
        user: 2
    };

    const jasmineConfiguration = jasmine.getEnv().configuration();
    jasmineConfiguration.random = false;
    jasmine.getEnv().configure(jasmineConfiguration);

    it('start with empty task list', async () => {
        await clear();
        expect((await findAll()).length).toBe(0);
    });

    it('ensure creating one task works', async () => {
        const task: Task = await create(testTask);
        expect((await findAll()).length).toBe(1);
        // @ts-expect-error
        delete task.id;
        expect(task as BaseTask).toEqual(testTask);
    });

    it('create anoher task and have two', async () => {
        await create(testTask);
        expect((await findAll()).length).toBe(2);
    });

    it(`expect ${taskDatabaseSize} tasks to be the limit`, async () => {
        // Fill data base to limit
        clear();
        for (let i = 0; i < taskDatabaseSize; i++) await create(testTask);

        // Try to add one more
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
        expect(allTasks[0]).not.toEqual(allTasks[1]);
        let task = allTasks[1];
        let id = task.id;
        expect(task as BaseTask).toEqual(allTasks[1]);
        task = await find(id);
        expect(task as BaseTask).toEqual(allTasks[1]);

        task.name = 'Some other name';
        // @ts-expect-error
        delete task.id;
        await update(id, task);
        task.id = id;
        let task1: Task = await find(id);
        expect(task as BaseTask).toEqual(task1);
    });

    it('error on find(wrong id)', async () => {
        let errType: Error | undefined = undefined;
        try {
            await find(-1);
        } catch (e) {
            errType = e;
        }
        expect(errType).toBeInstanceOf(ReferenceError);
    });

    it('delete and clear', async () => {
        let cnt: number = (await findAll()).length;
        let anId: number = (await findAll())[1].id;
        await remove(anId);
        expect((await findAll()).length).toBe(cnt - 1);
        await clear();
        expect((await findAll()).length).toBe(0);
    });

    it('expect error on illegal post', async () => {
        await clear();
        const illegalTask: BaseTask = {};
        // @ts-expect-error
        illegalTask['something'] = 'is illegal';

        let errType: Error | undefined = undefined;
        try {
            await create(illegalTask);
        } catch (e) {
            errType = e;
        }
        expect(errType).toBeInstanceOf(TypeError);

        // @ts-expect-error
        delete illegalTask.something;
        // @ts-expect-error
        illegalTask.dueDate = 'not a date';

        errType = undefined;
        try {
            await create(illegalTask);
        } catch (e) {
            errType = e;
        }
        expect(errType).toBeInstanceOf(TypeError);

        expect((await findAll()).length).toBe(0);
    });

    it('expect error on illegal update', async () => {
        const task: Task = await create(testTask);

        let errType: Error | undefined = undefined;
        try {
            await update(task.id + 1, testTask);
        } catch (e) {
            errType = e;
        }
        expect(errType).toBeInstanceOf(ReferenceError);

        const illegalTask: BaseTask = {};
        // @ts-expect-error
        illegalTask['something'] = 'is illegal';

        errType = undefined;
        try {
            await update(task.id, illegalTask);
        } catch (e) {
            errType = e;
        }
        expect(errType).toBeInstanceOf(TypeError);

        // @ts-expect-error
        delete illegalTask.something;
        // @ts-expect-error
        illegalTask.dueDate = 'not a date';

        errType = undefined;
        try {
            await update(task.id, illegalTask);
        } catch (e) {
            errType = e;
        }
        expect(errType).toBeInstanceOf(TypeError);
    });
});
