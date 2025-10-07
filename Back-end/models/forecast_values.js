import mongoose from 'mongoose'

const forecast_values_schema = new mongoose.Schema({
    ForecastID: {type: Number, required: true},
    ApplicationID: {type: Number, required: true},
    FileID: {type: Number, required: true},
    Value: {type: mongoose.Types.Decimal128, required: true}
})

export default mongoose.model("forecast_values", forecast_values_schema)