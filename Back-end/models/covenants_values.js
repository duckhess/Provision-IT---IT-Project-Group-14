import mongoose from 'mongoose'

const covenants_values_schema = new mongoose.Schema({
    CovenantsID: {type: Number, required: true},
    ApplicationID: {type: Number, required: true},
    Value: {type: Number, required: true},
    Comparator: {type: Boolean, required: true},
    Analysis: {type: Boolean, required: true}
})

export default mongoose.model("covenants_values", covenants_values_schema)