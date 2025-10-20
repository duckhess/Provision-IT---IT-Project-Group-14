import mongoose from 'mongoose'

const timeline_schema = new mongoose.Schema({
    FileID: {type: Number, required: true},
    period: {type: Number, required: true},
    periodLabel: {type: Date}
})

export default mongoose.model('timelines', timeline_schema)