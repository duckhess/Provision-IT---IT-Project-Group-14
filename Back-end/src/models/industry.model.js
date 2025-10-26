import mongoose from "mongoose";

const industry_schema = new mongoose.Schema(
  {
    IndustryID: { type: Number, required: true, unique: true, index: true },
    IndustryName: { type: String, required: true, trim: true },
  },
  { collection: "industries" },
);

export default mongoose.model("Industry", industry_schema);
