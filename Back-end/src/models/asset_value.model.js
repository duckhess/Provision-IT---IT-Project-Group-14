import mongoose from "mongoose"

const AssetValueSchema = new mongoose.Schema(
 {
  AssetsID: { type: Number, required: true, unique: true, index: true },
  FileID: { type: Number, required: true, index: true }, 
  ApplicationID: { type: Number, required: true, index: true },  
  Value: { type: mongoose.Types.Decimal128, required: true}            
 },
 { collection: 'assets_values', timestamps: false }
)

export default mongoose.model('assets_values', AssetValueSchema)
