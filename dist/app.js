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
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const error_ctrl_1 = require("./controllers/error.ctrl");
const auth_mw_1 = require("./middlewares/auth.mw");
const cors_mw_1 = require("./middlewares/cors.mw");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(cors_mw_1.cors);
app.get("/health", (req, res, next) => {
    res.send("OK");
});
app.use("/auth", auth_routes_1.default);
app.use(auth_mw_1.isAuth);
app.use(error_ctrl_1.error404Controller);
app.use(error_ctrl_1.errorController);
typeorm_1.createConnection()
    .then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connected to DB");
    app.listen(3000, () => console.log("Server runs on http://localhost:3000"));
}))
    .catch((error) => {
    console.log(error);
});
//# sourceMappingURL=app.js.map