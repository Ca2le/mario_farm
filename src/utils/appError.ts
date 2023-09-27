import { httpStatus } from "./generateResponse"

export class AppError extends Error {
    httpStatus: string;
    isOperational: boolean;
    
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.isOperational = true;
        this.httpStatus = httpStatus[statusCode];
        Error.captureStackTrace(this, this.constructor);
    }
}