import { app, PORT, HOSTNAME } from './server';
import { setNamespace, silencia } from './middleware/logging.middelware';
import http from 'http';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BaseTask, roundSeconds, getDefaultTask } from './tasks/task.interface';
import { typeCast, typeCastConverter_Date } from './common/typeCast';
import { response } from 'express';

setNamespace('Jasmine');
silencia(true);

const testTask: BaseTask = {
    name: 'Build Todo API',
    description: 'Use Swagger, Postman and Express',
    dueDate: roundSeconds(new Date('2021-05-24T10:51:16.432Z')),
    user: 2
};

describe('todo list (tasks):', () => {
    // No randomization here
    const jasmineConfiguration = jasmine.getEnv().configuration();
    jasmineConfiguration.random = false;
    jasmine.getEnv().configure(jasmineConfiguration);

    let httpServer: http.Server;
    beforeEach(() => {
        httpServer = http.createServer(app);
        httpServer.listen(PORT, HOSTNAME);
    });
    afterEach(function () {
        httpServer.close();
    });

    it('The initial list should be empty', async () => {
        let response = await instanceGet(instance, '/tasks');
        expect(response.data).toEqual([]);
        expect(response.status).toBe(200);

        response = await instanceGet(instance, '/tasks-xxx');
        expect(response.status).toBe(404);
    });

    // Post tests -------------------------------------
    it('Post tasks: Ok case', async () => {
        let response = await instancePost(instance, '/tasks', testTask);
        expect(response.status).toBe(201);
        delete response.data.id;
        const result = {
            ...(typeCast(getDefaultTask(), response.data, {
                dueDate: typeCastConverter_Date
            }) as BaseTask)
        };
        expect(result).toEqual(testTask);
        expect(await nofTasks()).toBe(1);
    });

    it('Post empty task, get default task back', async () => {
        let response = await instancePost(instance, '/tasks', {});
        expect(response.status).toBe(201);
        delete response.data.id;
        const result = {
            ...(typeCast(getDefaultTask(), response.data, {
                dueDate: typeCastConverter_Date
            }) as BaseTask)
        };
        expect(result).toEqual(getDefaultTask());
        expect(await nofTasks()).toBe(2);
    });

    it('Post illegal data', async () => {
        let response = await instancePost(instance, '/tasks', { illegal: 42 });
        expect(response.status).toBe(400);
        response = await instancePost(instance, '/tasks', { dueDate: 'not a date' });
        expect(response.status).toBe(400);
        expect(await nofTasks()).toBe(2);
    });

    it('find a specific task', async () => {
        let response = await instanceGet(instance, '/tasks');
        const task0 = response.data[0];
        response = await instanceGet(instance, '/tasks/' + task0.id);
        expect(task0).toEqual(response.data);
    });

    it('error when finding a specific task', async () => {
        let errType: Error | undefined = undefined;
        let response = await instanceGet(instance, '/tasks/' + -1);
        expect(response.status).toBe(404);
    });

    it('updating a taks', async () => {
        const count = await nofTasks();
        const task0 = (await instanceGet(instance, '/tasks')).data[0];
        const id = task0.id;
        delete task0.id;
        let response = await instancePut(instance, '/tasks/' + id, task0);
        task0.id = id;
        expect(response.data).toEqual(task0);
        expect(response.status).toBe(200);
        expect(await nofTasks()).toBe(count);
    });

    it('errors when updating a task', async () => {
        const count = await nofTasks();
        const id = (await instanceGet(instance, '/tasks')).data[0].id;

        // wrong id
        let response = await instancePut(instance, '/tasks/' + -1, {});
        expect(response.status).toBe(404);

        // illegal attribute
        response = await instancePut(instance, '/tasks/' + id, { something: 'is wrong' });
        expect(response.status).toBe(400);

        // illegal value
        response = await instancePut(instance, '/tasks/' + id, { dueDate: 'this is no date' });
        expect(response.status).toBe(400);

        expect(await nofTasks()).toBe(count);
    });

    it('delete tasks', async () => {
        const count = await nofTasks();
        const id = (await instanceGet(instance, '/tasks')).data[0].id;

        // wrong id
        let response = await instanceDelete(instance, '/tasks/' + -1);
        expect(response.status).toBe(404);

        // correct id
        response = await instanceDelete(instance, '/tasks/' + id);
        expect(response.status).toBe(204);

        expect(await nofTasks()).toBe(count - 1);
    });
});

async function nofTasks() {
    return (await instanceGet(instance, '/tasks')).data.length;
}

const instance = axios.create({
    baseURL: `http://${HOSTNAME}:${PORT}/api/todo`,
    timeout: 1000
});

async function instanceGet(instance: AxiosInstance, url: string) {
    return await instanceGetOrDelete(url, instance.get);
}

async function instanceDelete(instance: AxiosInstance, url: string) {
    return await instanceGetOrDelete(url, instance.delete);
}

async function instanceGetOrDelete(url: string, func: (url: string) => Promise<Response>) {
    try {
        const response = await func(url);
        return response;
    } catch (error) {
        if (error.response) return error.response;
        else throw error;
    }
}

async function instancePost(instance: AxiosInstance, url: string, data: any) {
    return await instancePostOrPut(url, data, instance.post);
}

async function instancePut(instance: AxiosInstance, url: string, data: any) {
    return await instancePostOrPut(url, data, instance.put);
}

async function instancePostOrPut(
    url: string,
    data: any,
    func: (url: string, data: any) => Promise<Response>
) {
    try {
        const response = await func(url, data);
        return response;
    } catch (error) {
        if (error.response) return error.response;
        else throw error;
    }
}
