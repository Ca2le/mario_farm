import { Response } from 'express';

enum httpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

const generateResponse = (res: Response, statusCode: number, message: string, payload?: any) => {
    console.log(process.env.NODE_ENV)
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