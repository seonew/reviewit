import mongoose, { Schema, models } from "mongoose";

export const BookSchema = new Schema({
  id: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  bookLike: {
    type: Boolean,
    required: true,
  },
  like: {
    type: Boolean,
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  loginType: {
    type: String,
  },
  avatarUrl: {
    type: String,
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
