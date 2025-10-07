import mongoose from 'mongoose'

const wcm_schema = new mongoose.Schema({
    CapitalID: {type: Number, required: true},
    Metric: {type: String, required: true},
    Unit: {type: String, required: true}
})

export default mongoose.model('working_capital_movements', wcm_schema)