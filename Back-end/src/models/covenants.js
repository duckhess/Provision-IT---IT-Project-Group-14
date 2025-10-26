import mongoose from "mongoose";

const covenants_schema = new mongoose.Schema({
  CovenantsID: { type: Number, required: true },
  Metric: { type: String, required: true },
  Benchmark: { type: Number, required: true },
  Category: { type: String, required: true },
  Unit: { type: String, required: true },
});

export default mongoose.model("covenants", covenants_schema);
