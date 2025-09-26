import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import industry_router from './routes/industry.routes.js'
import company_routes from './routes/company.routes.js'
import key_ratio_routes from './routes/key_ratio.routes.js'
import abs_router from './routes/abs_benchmarkings.routes.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 7000
const MONGOURL = process.env.DB_URL

mongoose.connect(MONGOURL).then(() => {
    console.log("Database is connected successfully")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error) => console.log(error))

app.use("/industries", industry_router)
app.use("/companies", company_routes)
app.use("/key_ratios", key_ratio_routes)
app.use("/abs_benchmarkings", abs_router)