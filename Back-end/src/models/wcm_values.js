import mongoose from "mongoose";

const wcm_values_schema = new mongoose.Schema({
  CapitalID: { type: Number, required: true },
  ApplicationID: { type: Number, required: true },
  FileID: { type: Number, required: true },
  Value: { type: Number, required: true },
});

export default mongoose.model("working_capital_movements_values", wcm_values_schema);
