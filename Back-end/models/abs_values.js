import mongoose from 'mongoose'

const abs_value_schema = new mongoose.Schema({
    ABSID: {type: Number, required: true},
    ApplicationID: {type: Number, required: true},
    ANZICCode: {type: Number},
    Field: {type: String},
    ABSValue: {type: Number, required: true},
    CalcValue: {type: Number, required: true},
    Analysis: {type: Boolean, required: true}
})

export default mongoose.model('abs_benchmarkings_values', abs_value_schema)