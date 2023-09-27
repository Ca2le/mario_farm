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
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('server module loaded');
        const password = process.env.PASSWORD;
        const user = process.env.USER;
        const uri = process.env.URI;
        const databaseURI = uri.replace("<%%PASSWORD%%>", password).replace("<%%USER%%>", user);
        try {
            yield mongoose_1.default.connect(databaseURI);
            console.log("Connected to the database");
        }
        catch (error) {
            console.error("Error connecting to the database: ", error);
        }
    });
}
exports.connectToDB = connectToDB;
//# sourceMappingURL=server.js.map