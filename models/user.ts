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
  registerDate: {
    type: Date,
    required: true,
  },
  updateDate: {
    type: Date,
    required: true,
  },
});

const User = models?.Bookmark ?? mongoose.model("User", UserSchema);

export default User;
