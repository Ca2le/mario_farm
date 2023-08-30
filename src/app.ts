import { Pokemon } from "./models/pokemonModel";
import pokemonRoutes from "./routes/pokemonRoute";
import { connectToDB } from "./server";
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT
app.use(express.json())
app.use('/', pokemonRoutes)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
    connectToDB()
})





