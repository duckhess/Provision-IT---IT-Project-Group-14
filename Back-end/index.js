import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import industry_routes from './routes/industry.routes.js'
import company_routes from './routes/company.routes.js'
import key_ratio_routes from './routes/key_ratio.routes.js'
//import abs_router from './routes/abs_benchmarkings.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 7000
const MONGOURL = process.env.MONGO_URL

mongoose.connect(MONGOURL).then(()=>{
    console.log("Database is connected successfully.")
    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`)

    });
})
.catch((error)=> console.log(error));


app.use("/industries", industry_routes)
app.use("/companies", company_routes)
app.use("/keyRatios", key_ratio_routes)


//http://localhost:3000/companies
//http://localhost:3000/industries
//http://localhost:3000/industries?industryID=5
//http://localhost:3000/keyRatios?unit=%&fileid=2
