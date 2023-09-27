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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const confirmPasswordValidator = {
    validator: function (confirmPassword) {
        if (this.password === confirmPassword)
            return true;
        return false;
    },
    message: (props) => `Your password don't match! Try again.`
};
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter a valid username."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter your email."]
    },
    password: {
        type: String,
        required: [true, "Please enter a password."],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, "Please repeat your password."],
        minlength: 8,
        validate: confirmPasswordValidator
    },
    avatar: {
        type: String,
        required: [true, "Please repeat your password."]
    }
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.hash(this.password, 12);
        this.password = salt;
        this.confirmPassword = "";
        next();
    });
});
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=userModel.js.map