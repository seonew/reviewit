import mongoose, { Schema, models } from "mongoose";

export const PlaceSchema = new Schema({
  id: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  contentId: {
    type: String,
    required: true,
  },
  contentLike: {
    type: Boolean,
    required: true,
  },
  like: {
    type: Boolean,
  },
  userName: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  registerDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
  },
});

const Place = models?.Place || mongoose.model("Place", PlaceSchema);

export default Place;
