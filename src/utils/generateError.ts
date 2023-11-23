import { Request, Response, NextFunction } from "express"
import { AppError } from "./appError";
import { httpStatus } from "../types";
import { MongoError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { MongoDriverError, MongoServerError } from "mongodb";

interface MongoQueryError {
    code: string,
    errmsg: string
}
type MixedErrorType = MongoDriverError | AppError | MongooseError | Error

interface DevErrorInterface {
    statusCode: number,
    status: string,
    error: AppError,
    message: string,
    stack: string
}

function mongoErrorHandler(error: MixedErrorType) {

    if (error instanceof MongooseError.CastError) {
        return new AppError(`Invalid ${error.path}: ${error.value}.`, 400)
    }
    if (error instanceof MongooseError.ValidationError) {
        const errors = Object.values(error.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        return new AppError(message, 400);

    }
    if ('code' in error) {
        if (error.code === 11000) {
            const value = error.errmsg.match(/"([^"]+)"/)
            if (value) {
                const message = `Duplicate field value: ${value[0]}. Please use another value!`;
                return new AppError(message, 400);
            } else return new AppError("Unkown validator error from Mongo Server Error", 500);


        }
        else return new AppError("Mongo driver error.", 500)

    }

    else return new AppError(`Please configure mongoErrorHandler to use error: ${error.name}.`, 566)
}

function errorGenerator(error: any, res: Response, next: NextFunction) {
    switch (process.env.NODE_ENV) {
        case "PRODUCTION": {
            if (error instanceof AppError) {
                return res
                    .status(error.statusCode)
                    .end(`${httpStatus[error.statusCode]} (${error.statusCode})`);
            }
            else return res
                .status(500)
                .end(`${httpStatus[500]} (500)`);

        }
        case "DEVELOPMENT": {
            let appError = { ...error }
            if (error instanceof AppError === false) {
                appError = mongoErrorHandler(error)
            }

            const devError: DevErrorInterface = {
                statusCode: appError.statusCode,
                status: httpStatus[appError.statusCode],
                error: error,
                message: appError.message,
                stack: appError.stack
            }

            return res.status(appError.statusCode).json(devError)
        }
        default: return res.status(500).end(`current node environment is ${process.env.NODE_ENV}`)
    }

}

export default errorGenerator