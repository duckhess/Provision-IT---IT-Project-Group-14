import mongoose from "mongoose"

const company_schema = new mongoose.Schema(
  {
    CompanyID: { type: Number, required: true, unique: true, index: true },
    CompanyName: { type: String, required: true, trim: true },
    IndustryID: { type: Number, required: true }
  },
  { collection: "companies" }
)

export default mongoose.model("Company", company_schema)
