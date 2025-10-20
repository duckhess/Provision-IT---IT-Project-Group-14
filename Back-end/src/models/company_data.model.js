import mongoose from "mongoose"

const CompanyDataSchema = new mongoose.Schema(
 {
    CompanyID: { type: Number, required: true, unique: true, index: true },
    CompanyName: { type: String, required: true },
    Industry: { type: String, required: true },
    IndustryID: { type: Number, required: true },
    ApplicationID: { type: Number, required: true, index: true },
    YearEstablished: { type: Date, required: true },
    Location: { type: String, required: true },
    UsageOfFunds: { type: String, required: true },
    Amount: { type: String, required: true },
    EnvironmentalScore: { type: Number },
    SocialScore: { type: Number },
    GovernanceScore: { type: Number},
    ShortGeneralDescription: { type: String },
    LongGeneralDescription: { type: String },
    ShortApplicationDescription: { type: String },
    LongApplicationDescription: { type: String },
  },
 { collection: 'company_datas', timestamps: false }
)

export default mongoose.model('company_datas', CompanyDataSchema)
