"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
function globalError(err, req, res, next) {
    res.status(500).send('Something broke!');
}
exports.globalError = globalError;
//# sourceMappingURL=errorController.js.map