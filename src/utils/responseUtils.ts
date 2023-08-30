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

const generateResponse = (
    res: Response,
    status: httpStatus,
    message: string,
    payload?: any
) => {
    const response = {
        status,
        message,
        payload
    };
    res.status(status).json(response);
};

export { httpStatus, generateResponse };