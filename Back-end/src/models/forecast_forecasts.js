import mongoose, { mongo } from "mongoose";

const forecast_forecasts_schema = new mongoose.Schema({
  ForecastID: { type: Number, required: true },
  ApplicationID: { type: Number, required: true },
  "Avg Hist Forecast": mongoose.Types.Decimal128,
  "Avg Hist % Change": Number,
  "Avg Hist % to Revenue": Number,
  "Avg Hist Ratio Expression": Number,
  "Cashflow Movement Avg Hist": mongoose.Types.Decimal128,
  "User Forecast": mongoose.Types.Decimal128,
  "User Forecast % Change": Number,
  "User Ratio Expression": Number,
  "Cashflow Movement User Forecast": mongoose.Types.Decimal128,
});

export default mongoose.model("forecast_forecasts", forecast_forecasts_schema);
