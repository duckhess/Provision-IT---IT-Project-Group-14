import mongoose, { mongo } from 'mongoose'

const finanical_values_schema = new mongoose.Schema({
    FinancialID: {type: Number, required: true},
    ApplicationID: {type: Number, required: true},
    FileID: {type: Number, required: true},
    Value: {type: mongoose.Types.Decimal128, required: true}
})

export default mongoose.model("financial_statements_values", finanical_values_schema)