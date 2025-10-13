import mongoose from "mongoose";

const LiabilitySchema = new mongoose.Schema(
  {
  LiabilitiesID: { type: Number, required: true, unique: true, index: true },
  Metric: { type: String, required: true, index: true }, 
  Unit: { type: String, required: true }              
  },
  { collection: 'liabilities', timestamps: false }
);

export default mongoose.model('liabilities', LiabilitySchema);
