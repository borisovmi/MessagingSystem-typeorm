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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_chain_builders_1 = require("express-validator/src/middlewares/validation-chain-builders");
const typeorm_1 = require("typeorm");
const auth_ctrl_1 = require("../controllers/auth.ctrl");
const User_1 = require("../models/User");
const router = express_1.Router();
router.post("/login", auth_ctrl_1.loginController);
router.post("/signup", [
    validation_chain_builders_1.body("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield typeorm_1.getRepository(User_1.User).findOne({
            where: { email: value },
        });
        if (user) {
            return Promise.reject("E-Mail address already exists!");
        }
    }))
        .normalizeEmail(),
    validation_chain_builders_1.body("password").trim().isLength({ min: 5 }),
    validation_chain_builders_1.body("name").trim().not().isEmpty(),
], auth_ctrl_1.signupController);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map