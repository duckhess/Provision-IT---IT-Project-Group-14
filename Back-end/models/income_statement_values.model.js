import mongoose from "mongoose";

const IncomeValueSchema = new mongoose.Schema(
 {
  IncomeID: { type: Number, required: true, unique: true, index: true },
  FileID: { type: Number, required: true, index: true }, 
  ApplicationID: { type: Number, required: true, index: true },  
  Value: { type: mongoose.Types.Decimal128, required: true}            
 },
 { collection: 'income_statement_values', timestamps: false }
);

export default mongoose.model('income_statement_values', IncomeValueSchema);
