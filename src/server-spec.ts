import { app, PORT, HOSTNAME } from './server';
import { setNamespace } from './middleware/logging.middelware';
import http from 'http';
import axios from 'axios';

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
        const data = await getTasks('/tasks');
        expect(data).toEqual([]);
    });
});

const instance = axios.create({
    baseURL: `http://${HOSTNAME}:${PORT}/api/todo`,
    timeout: 1000
});

async function getTasks(path: string) {
    const response = await instance.get(path);
    return response.data;
}
