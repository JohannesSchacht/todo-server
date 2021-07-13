import { app, PORT, HOSTNAME } from './server';
import { setNamespace } from './middleware/logging.middelware';
import http from 'http';

setNamespace('server');

process.on('uncaughtException', (msg) => console.error(`uncaught exception: ${msg}`));

const httpServer = http.createServer(app);
httpServer.listen(PORT, HOSTNAME, () => console.log(`Server is running -> ${HOSTNAME}:${PORT}`));
