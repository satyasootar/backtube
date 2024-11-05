import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import router from './routes/user.routes.js'

//routes declaration

app.use("/api/v1/users", router)
