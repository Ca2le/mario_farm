"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncError = void 0;
const catchAsyncError = (routeFn) => {
    return (req, res, next) => {
        routeFn(req, res, next).catch((err) => {
            next(err);
        });
    };
};
exports.catchAsyncError = catchAsyncError;
//# sourceMappingURL=catchAsyncError.js.map