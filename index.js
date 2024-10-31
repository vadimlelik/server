import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import autRouter from './routes/autRoute.js'
import userRoute from './routes/userRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
		optionSuccessStatus: 200,
	})
)

app.use('/api/v1/auth', autRouter)
app.use('/api/v1/users', userRoute)

app.listen(process.env.PORT, async () => {
	await mongoose.connect(process.env.MONGO_URI)
	console.log(`Server listening on port ${process.env.PORT}`)
})
