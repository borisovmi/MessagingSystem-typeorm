"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(status, message, validationErrors = []) {
        super(message);
        this.status = status;
        this.message = message;
        this.validationErrors = validationErrors;
        this.status = status;
        this.message = message.toString();
        this.validationErrors = validationErrors;
    }
}
exports.HttpException = HttpException;
//# sourceMappingURL=error.js.map