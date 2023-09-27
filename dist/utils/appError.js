"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const generateResponse_1 = require("./generateResponse");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = true;
        this.httpStatus = generateResponse_1.httpStatus[statusCode];
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=appError.js.map