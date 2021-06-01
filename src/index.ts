import { app, PORT, HOSTNAME } from './server';
import { setNamespace } from './middleware/logging.middelware';
import http from 'http';

setNamespace('server');

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => console.log(`Server is running ${HOSTNAME}:${PORT}`));
