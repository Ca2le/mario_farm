import { connectToDB } from "./server";
import express from "express"
import dotenv from "dotenv"
import { AppError } from "./utils/appError";
import globalError from "./utils/generateError";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from 'hpp'
import router from "./routes/routes";

process.on("unhandledRejection", (error, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', error);
})

process.on('uncaughtException', (error, origin) => {
    console.log('Uncaught exception at:', origin, 'reason:', error);
});

dotenv.config()
const word = "dude got some ass 👨🏿‍🍳"

const buffWord = Buffer.from(word, "utf-8")
console.log(buffWord)
const app = express()
const port = process.env.PORT
const limiter = rateLimit({
    limit: 4,
    windowMs: 3_600_000, // 1hour
    message: "To many attempts from this IP, please try again later."
})
app.use(helmet())
app.use(ExpressMongoSanitize())
app.use(hpp({ whitelist: ["type"] }))

app.use("/forgot-password", limiter)
app.use(express.json())
app.use("/", router)

app.all("*", (req, res, next) => {
    next(new AppError("Page dont exist... 🤷‍♂️", 404))
})

app.use(globalError)

app.listen(port, () => {
    console.log(`You are current running in ${process.env.NODE_ENV} environment`)
    console.log(`Server is running on port: ${port}`)
    connectToDB()
})






