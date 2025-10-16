import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import industry_router from './routes/industry.routes.js'
import company_routes from './routes/company.routes.js'
import key_ratio_routes from './routes/key_ratio.routes.js'
import abs_router from './routes/abs_benchmarkings.routes.js'
import wcm_router from './routes/working_capital_movements.routes.js'
import covenants_router from './routes/covenants.routes.js'
import financial_router from './routes/financial_statements.routes.js'
import forecast_router from './routes/forecasts.routes.js'
import cash_router from './routes/cash_equivalences.routes.js'
import liability_router from './routes/liability.routes.js'
import asset_router from './routes/asset.routes.js'
import equity_router from './routes/equity.routes.js'
import income_router from './routes/income_statement.routes.js'
import soc_router from './routes/statement_of_cashflows.routes.js'
import company_data_router from './routes/company_data.routes.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000
const MONGOURL = process.env.MONGO_URL

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
app.use("/working_capital_movements", wcm_router)
app.use("/covenants", covenants_router)
app.use("/financial_statements", financial_router)
app.use("/forecasts", forecast_router)
app.use("/cash_equivalences", cash_router)
app.use("/liabilities", liability_router)
app.use("/assets", asset_router)
app.use("/equities", equity_router)
app.use("/income_statements", income_router)
app.use("/statement_of_cashflows", soc_router)
app.use("/company_data", company_data_router)

//http://localhost:3000/companies
//http://localhost:3000/industries
//http://localhost:3000/industries?industryID=5
//http://localhost:3000/keyRatios?unit=%&fileid=2
