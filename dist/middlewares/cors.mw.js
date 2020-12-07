"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
exports.cors = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Acces-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
};
//# sourceMappingURL=cors.mw.js.map