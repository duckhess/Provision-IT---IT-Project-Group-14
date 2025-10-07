import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
  AssetsID: { type: Number, required: true, unique: true, index: true },
  AccountDescription: { type: String, required: true, index: true }, 
  Unit: { type: String, required: true }              
  },
  { collection: 'assets', timestamps: false }
);

export default mongoose.model('assets', AssetSchema);
