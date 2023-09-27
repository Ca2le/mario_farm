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
exports.routeAuth = exports.login = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const generateResponse_1 = require("../utils/generateResponse");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const expiresIn = process.env.JWT_TIME_STAMP;
    const secret = process.env.JWT_SECRET;
    if (expiresIn && secret) {
        return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn });
    }
    else
        throw new Error("Failed to generate token!🐮");
});
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password, confirmPassword, avatar } = req.body;
            const userObj = {
                name,
                email,
                password,
                confirmPassword,
                avatar
            };
            const user = yield userModel_1.User.create(userObj);
            const token = yield generateToken(user._id);
            (0, generateResponse_1.generateResponse)(res, 201, `${name} was succesfully created with token: ${token}`);
        }
        catch (err) {
            (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.INTERNAL_SERVER_ERROR, `Element was not created.`, err);
        }
    });
}
exports.signUp = signUp;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id, email, password } = req.body;
            const user = yield userModel_1.User.findOne({ email });
            if (user) {
                const validUser = yield bcrypt_1.default.compare(password, user.password);
                if (validUser) {
                    const token = yield generateToken(_id);
                    (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.OK, `Welcome ${user.name}-kenobi`, token);
                }
                else
                    (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.UNAUTHORIZED, "Please try another email or password.");
            }
            else
                (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.UNAUTHORIZED, "Please try another email or password.");
        }
        catch (err) {
            (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.INTERNAL_SERVER_ERROR, `Element was not created.`, err);
        }
    });
}
exports.login = login;
function routeAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("header,: ", req.header);
            console.log("headerS,: ", req.headers);
            const { authorization } = req.headers;
            if (typeof (authorization) === "string" && process.env.JWT_SECRET) {
                const token = authorization.replace(/^Bearer\s+/i, '');
                console.log(token);
                const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                console.log("payload👳🏿 ", payload);
                next();
            }
            else {
                console.log("Not auth I gess.... 🚫🥗");
                (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.OK, "Ok");
            }
        }
        catch (err) {
            (0, generateResponse_1.generateResponse)(res, generateResponse_1.httpStatus.UNAUTHORIZED, "Bad token");
        }
    });
}
exports.routeAuth = routeAuth;
//# sourceMappingURL=authController.js.map