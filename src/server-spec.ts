import { app, PORT, HOSTNAME } from './server';
import { setNamespace, silencia } from './middleware/logging.middelware';
import http from 'http';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BaseTask, roundSeconds, getDefaultTask } from './tasks/task.interface';
import { typeCast, typeCastConverter_Date } from './common/typeCast';

setNamespace('Jasmine');
silencia(true);

const testTask: BaseTask = {
    name: 'Build Todo API',
    description: 'Use Swagger, Postman and Express',
    dueDate: roundSeconds(new Date('2021-05-24T10:51:16.432Z')),
    user: 2
};

describe('todo list: tasks', () => {
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
        response = await instanceGet(instance, '/tasks');
        expect(response.data.length).toBe(1);
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
        response = await instanceGet(instance, '/tasks');
        expect(response.data.length).toBe(2);
    });

    it('Post illegal data', async () => {
        let response = await instancePost(instance, '/tasks', { illegal: 42 });
        expect(response.status).toBe(400);
        response = await instancePost(instance, '/tasks', { dueDate: 'not a date' });
        expect(response.status).toBe(400);
    });
});

const instance = axios.create({
    baseURL: `http://${HOSTNAME}:${PORT}/api/todo`,
    timeout: 1000
});

async function instanceGet(instance: AxiosInstance, url: string) {
    try {
        const response = await instance.get(url);
        return response;
    } catch (error) {
        if (error.response) return error.response;
        else throw error;
    }
}

async function instancePost(instance: AxiosInstance, url: string, data: any) {
    try {
        const response = await instance.post(url, data);
        return response;
    } catch (error) {
        if (error.response) return error.response;
        else throw error;
    }
}
