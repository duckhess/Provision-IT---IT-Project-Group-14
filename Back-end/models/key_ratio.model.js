import mongoose from "mongoose"

const KeyRatioSchema = new mongoose.Schema(
  {
  KeyRatioID: { type: Number, required: true, unique: true, index: true },
  Metric: { type: String, required: true, index: true }, 
  Unit: { type: String, required: true }              
  },
  { collection: 'key_ratios', timestamps: false }
)

export default mongoose.model('key_ratios', KeyRatioSchema)
