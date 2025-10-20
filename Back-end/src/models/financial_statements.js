import mongoose from 'mongoose'

const financial_schema = new mongoose.Schema({
    FinancialID: {type: Number, required: true},
    Metric: {type: Number, required: true},
    Unit: {type: Number, required: true}
})

export default mongoose.model("financial_statements", financial_schema)