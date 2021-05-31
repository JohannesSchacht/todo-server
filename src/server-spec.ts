import { app, PORT, HOSTNAME } from './server';
import { setNamespace } from './middleware/logging.middelware';
import http from 'http';

setNamespace('Jasmine');

describe('todo list: tasks', () => {
    let httpServer: http.Server;

    beforeEach(() => {
        httpServer = http.createServer(app);
        httpServer.listen(PORT, HOSTNAME);
    });

    afterEach(function () {
        httpServer.close();
    });

    it('The initial list should be empty', () => {
        expect(0).toBe(0);
    });
});
