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
const generateResponse = (res, status, message, payload) => {
    const response = {
        status,
        message,
        payload
    };
    res.status(status).json(response);
};
exports.generateResponse = generateResponse;
//# sourceMappingURL=responseUtils.js.map