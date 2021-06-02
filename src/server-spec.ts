import { app, PORT, HOSTNAME } from './server';
import { setNamespace } from './middleware/logging.middelware';
import http from 'http';
import axios, { AxiosResponse } from 'axios';

setNamespace('Jasmine');

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
        const response = await instance.get('/tasks');
        expect(response.data).toEqual([]);

        try {
            const r1 = await instance.get('/taskscc');
        } catch (error) {
            console.log(error.message);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }
    });
});

const instance = axios.create({
    baseURL: `http://${HOSTNAME}:${PORT}/api/todo`,
    timeout: 1000
});
