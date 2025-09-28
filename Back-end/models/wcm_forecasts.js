import mongoose from 'mongoose'

const wcm_forecasts_schema = new mongoose.Schema({
    CapitalID: {type: Number, required: true},
    ApplicationID: {type: Number, required: true},
    "Avg Historical Forecast": {type: Decimal128, required: true},
    "User Forecast": {type: Decimal128, required: true},
})

export default mongoose.model('working_capital_movements_forecasts', wcm_forecasts_schema)