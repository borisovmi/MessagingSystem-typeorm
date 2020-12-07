"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../models/error");
const jwt_secret_1 = require("../utils/jwt.secret");
exports.isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new error_1.HttpException(401, "Please login");
    }
    const token = authHeader.split(" ")[1];
    let decodedUser;
    try {
        decodedUser = jsonwebtoken_1.default.verify(token, jwt_secret_1.jwtSecret);
    }
    catch (error) {
        throw new error_1.HttpException(401, error.message);
    }
    if (!decodedUser) {
        throw new error_1.HttpException(401, "Not Authenticated.");
    }
    req.user = decodedUser;
    next();
};
//# sourceMappingURL=auth.mw.js.map