"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = exports.httpStatus = void 0;
var httpStatus;
(function (httpStatus) {
    httpStatus[httpStatus["OK"] = 200] = "OK";
    httpStatus[httpStatus["CREATED"] = 201] = "CREATED";
    httpStatus[httpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    httpStatus[httpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    httpStatus[httpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    httpStatus[httpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    httpStatus[httpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    httpStatus[httpStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    httpStatus[httpStatus["CONFLICT"] = 409] = "CONFLICT";
    httpStatus[httpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    httpStatus[httpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(httpStatus || (httpStatus = {}));
exports.httpStatus = httpStatus;
const generateResponse = (res, statusCode, message, payload) => {
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
        default: return res.status(statusCode).end('Please configure node environment');
    }
};
exports.generateResponse = generateResponse;
//# sourceMappingURL=generateResponse.js.map