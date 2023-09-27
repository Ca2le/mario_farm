"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pokemonRoute_1 = __importDefault(require("./routes/pokemonRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const server_1 = require("./server");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = require("./utils/appError");
const errorController_1 = require("./controller/errorController");
dotenv_1.default.config();
console.log("app module loaded");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use("/", pokemonRoute_1.default, userRoute_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.AppError("Page dont exist... 🤷‍♂️", 404));
});
app.use(errorController_1.globalError);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    (0, server_1.connectToDB)();
});
//# sourceMappingURL=app.js.map