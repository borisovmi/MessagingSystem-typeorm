"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signupController = void 0;
const bcryptjs_1 = require("bcryptjs");
const validation_result_1 = require("express-validator/src/validation-result");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const error_1 = require("../models/error");
const User_1 = require("../models/User");
const jwt_secret_1 = require("../utils/jwt.secret");
exports.signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validation_result_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new error_1.HttpException(422, "Validation failed.", errors.array()));
    }
    try {
        const hashedPassword = yield bcryptjs_1.hash(req.body.password, 12);
        const user = new User_1.User();
        user.email = req.body.email;
        user.name = req.body.name;
        user.password = hashedPassword;
        const createdUser = yield typeorm_1.getConnection().getRepository(User_1.User).save(user);
        const token = signUserToken(createdUser.id, createdUser.email, createdUser.name);
        yield typeorm_1.getConnection().close();
        res.status(201).json({ token });
    }
    catch (error) {
        next(new error_1.HttpException(500, "User signup failed. Try again."));
    }
});
exports.loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    try {
        const user = yield typeorm_1.getRepository(User_1.User).findOne({
            where: { email: req.body.email },
        });
        if (!user) {
            throw new error_1.HttpException(422, `User with email ${req.body.email} doesn't exist.`);
        }
        const isCorrectPassword = bcryptjs_1.compareSync(password, user.password);
        if (!isCorrectPassword) {
            throw new error_1.HttpException(422, "Wrong password");
        }
        const token = signUserToken(user.id, user.email, user.name);
        res.status(200).json({ token });
    }
    catch (error) {
        next(new error_1.HttpException(500, error));
    }
});
function signUserToken(userId, email, name) {
    return jsonwebtoken_1.default.sign({
        userId,
        email,
        name,
    }, jwt_secret_1.jwtSecret, { expiresIn: "24h" });
}
//# sourceMappingURL=auth.ctrl.js.map