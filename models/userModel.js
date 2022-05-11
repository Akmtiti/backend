import mongoose from "mongoose";
const { Schema } = mongoose;

const userScheme = mongoose.Schema({
  username: { type: String, unique: true, required: true, dropDups: true },
  email: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, required: true, dropDups: true },
  passwordRecovery: {
    type: String,
    default: null,
  },
  privilege: { type: String, required: true },
  token: { type: String, default: null },
  refreshToken: { type: String, default: null },
});
export default mongoose.model("user", userScheme);
