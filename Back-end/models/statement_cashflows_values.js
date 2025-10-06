import mongoose from 'mongoose'

const statement_values_schema = new mongoose.Schema({
    CashflowID: {type: Number, required: true},
    ApplicationID: {type: Number, required: true},
    FileID: {type: Number, required: true},
    Value: {type: Decimal128, required: true}
})

export default mongoose.model("statement_of_cashflows_values", statement_values_schema)