import mongoose from 'mongoose'

const forecast_schema = new mongoose.Schema({
    ForecastID: {type: Number, required: true},
    AccountDescription: {type: String, required: true},
    Unit: {type: String, required: true}
})

export default mongoose.model("forecast", forecast_schema)