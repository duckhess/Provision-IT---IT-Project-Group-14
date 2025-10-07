import mongoose from 'mongoose'

const wcm_forecasts_schema = new mongoose.Schema({
    CapitalID: {type: Number, required: true},
    ApplicationID: {type: Number, required: true},
    "Avg Historical Forecast": mongoose.Types.Decimal128,
    "User Forecast": mongoose.Types.Decimal128
})

export default mongoose.model('working_capital_movements_forecasts', wcm_forecasts_schema)