import mongoose from "mongoose";

const KeyRatioValueSchema = new mongoose.Schema(
 {
  KeyRatioID: { type: Number, required: true, index: true },
  ApplicationID: { type: Number, required: true, index: true }, 
  FileID: { type: Number, required: true, index: true },  
  Value: { type: Number, required: true}            
 },
 { collection: 'key_ratios_values', timestamps: false }
);

export default mongoose.model('key_ratios_values', KeyRatioValueSchema);
