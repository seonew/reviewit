import mongoose, { Schema, models } from "mongoose";

export const MovieSchema = new Schema({
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
  contentTitle: {
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

const Movie = models?.Movie ?? mongoose.model("Movie", MovieSchema);

export default Movie;
