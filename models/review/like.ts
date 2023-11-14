import mongoose, { Schema, models } from "mongoose";

export const LikeSchema = new Schema({
  id: {
    type: String,
  },
  reviewId: {
    type: String,
    required: true,
  },
  contentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  registerDate: {
    type: Date,
  },
});

const Like = models?.Like ?? mongoose.model("Like", LikeSchema);

export default Like;
