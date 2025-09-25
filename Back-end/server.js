import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import abs_router from './routes/abs_benchmarkings.js'

const app = express()
dotenv.config()

app.use(express.json())
app.use('/abs_benchmarkings', abs_router)

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// localhost:3000/abs_benchmarkings
app.listen(3000, () => console.log('Server Started'))