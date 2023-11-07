import { Response } from 'express';
import { httpStatus } from '../types';

const generateResponse = (res: Response, statusCode: number, message: string, payload?: any) => {
    switch (process.env.NODE_ENV) {
        case "PRODUCTION": {
            return res.status(statusCode).end(`${statusCode} (${httpStatus[statusCode]})`);
        }
        case "DEVELOPMENT": {
            const responseObject = {
                status: `${statusCode} (${httpStatus[statusCode]})`,
                message,
                payload: payload || null
            };
            return res.status(statusCode).json(responseObject);
        }
        default: return res.status(statusCode).end('Please configure node environment')
    }
};

export { httpStatus, generateResponse };