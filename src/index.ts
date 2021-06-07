import { app, PORT, HOSTNAME } from './server';
import { setNamespace } from './middleware/logging.middelware';
import http from 'http';

setNamespace('server');

const httpServer = http.createServer(app);
try {
    httpServer.listen(PORT, HOSTNAME, () => console.log(`Server is running ${HOSTNAME}:${PORT}`));
} catch (e) {
    console.log(`unexpected server termination: ${e.message}`);
}
console.log(`regular server termination`);
