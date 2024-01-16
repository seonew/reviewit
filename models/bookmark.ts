import mongoose, { Schema, models } from "mongoose";

export const BookmarkSchema = new Schema({
  id: {
    type: String,
  },
  contentId: {
    type: String,
    required: true,
  },
  contentImgUrl: {
    type: String,
    required: true,
  },
  contentTitle: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  contentType: {
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

const Bookmark = models?.Bookmark ?? mongoose.model("Bookmark", BookmarkSchema);

export default Bookmark;
