import mongoose, { Schema, models } from "mongoose";

export const BookSchema = new Schema({
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
  contentImgUrl: {
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
  registDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
  },
});

const Book = models?.Book || mongoose.model("Book", BookSchema);

export default Book;
