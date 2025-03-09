import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import mongoose from "mongoose"
import cors from "cors"
import authRouter from './routes/auth.router'
import tryoutRouter from './routes/tryout.router'
import questionRouter from "./routes/question.router";
import submissionRouter from "./routes/submission.router";

dotenv.config()

const app: Express = express()
const port = process.env.port || 3000

const MONGO_URL: string = process.env.DATABASE_URL || 'mongodb://localhost/quiz'
mongoose.connect(MONGO_URL)
const db = mongoose.connection
db.once('open', () => console.log("Connected to Mongoose"))

app.use(cookieParser())
app.use( cors({ origin: 'http://localhost:8080', credentials: true,}) )
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/tryout', tryoutRouter)
app.use('/api/tryout', questionRouter)  
app.use('/api/submission', submissionRouter)       



app.listen(port, () => console.log(`[server]: Server is running at http://localhost:${port}`))