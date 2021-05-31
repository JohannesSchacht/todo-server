import { Request, Response, NextFunction } from 'express';

export const setNamespace = (n: string) => (NAMESPACE = n);

let NAMESPACE = '???';

export const loggingHandler = (request: Request, response: Response, next: NextFunction) => {
    info(
        NAMESPACE,
        `METHOD: [${request.method}] - URL: [${request.url}] - IP: [${request.socket.remoteAddress}]`
    );
    response.on('finish', () => {
        info(
            NAMESPACE,
            `METHOD: [${request.method}] - URL: [${request.url}] - STATUS: [${response.statusCode}] - IP: [${request.socket.remoteAddress}]`
        );
    });
    next();
};

const info = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object);
    } else {
        console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`);
    }
};

const warn = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
    } else {
        console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
    }
};

const error = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object);
    } else {
        console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
    }
};

const debug = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object);
    } else {
        console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
    }
};

const getTimeStamp = (): string => {
    return new Date().toISOString();
};

export default {
    info,
    warn,
    error,
    debug
};
