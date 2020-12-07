"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error404Controller = exports.errorController = void 0;
const error_1 = require("../models/error");
exports.errorController = (error, req, res, next) => {
    const status = error.status;
    const message = error.message;
    const validationErrors = error.validationErrors;
    res
        .status(status)
        .json({ status, message, validationErrors: validationErrors });
};
exports.error404Controller = (req, res, next) => {
    throw new error_1.HttpException(404, "Not Found");
};
//# sourceMappingURL=error.ctrl.js.map