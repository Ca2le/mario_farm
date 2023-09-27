import pokemonRoutes from "./routes/pokemonRoute";
import userRoutes from "./routes/userRoute";
import { connectToDB } from "./server";
import express, { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import { generateResponse, httpStatus } from "./utils/generateResponse";
import { AppError } from "./utils/appError";
import { globalError } from "./controller/errorController";

dotenv.config()
console.log("app module loaded")
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use("/", pokemonRoutes, userRoutes)


app.all("*", (req, res, next) => {
    next(new AppError("Page dont exist... 🤷‍♂️", 404))
})

app.use(globalError)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
    connectToDB()
})





