import mongoose from "mongoose"

const EquityValueSchema = new mongoose.Schema(
 {
  EquityID: { type: Number, required: true, unique: true, index: true },
  FileID: { type: Number, required: true, index: true }, 
  ApplicationID: { type: Number, required: true, index: true },  
  Value: { type: mongoose.Types.Decimal128, required: true}            
 },
 { collection: 'equity_values', timestamps: false }
)

export default mongoose.model('equity_values', EquityValueSchema)
