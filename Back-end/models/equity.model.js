import mongoose from "mongoose";

const EquitySchema = new mongoose.Schema(
  {
  EquityID: { type: Number, required: true, unique: true, index: true },
  Metric: { type: String, required: true, index: true }, 
  Unit: { type: String, required: true }              
  },
  { collection: 'equity', timestamps: false }
);

export default mongoose.model('equity', EquitySchema);
