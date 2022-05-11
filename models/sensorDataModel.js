import mongoose from "mongoose"
const SensorDataScheme = mongoose.Schema(
  {
    device: String,
    value: String,
    unit: String,
  },
  { timestamps: true }
)
export default mongoose.model("SensorData", SensorDataScheme)