import mongoose, { Schema, models } from "mongoose";

export const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  loginType: {
    type: String,
    required: true,
  },
  loginService: {
    type: String,
    required: true,
  },
  registDate: {
    type: Date,
    required: true,
  },
  updateDate: {
    type: Date,
    required: true,
  },
});

const USER_DB_URI = process.env.USER_MONGODB_URI || "";
const conn = mongoose.createConnection(USER_DB_URI);

const User = models?.User || conn.model("User", UserSchema);

export default User;
