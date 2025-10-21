import mongoose from 'mongoose'

const abs_schema = new mongoose.Schema({
    ABSID: {type: Number, required: true},
    Benchmark: {type: String, required: true},
    Unit: {type: String, required: true}
})

export default mongoose.model('abs_benchmarkings', abs_schema)