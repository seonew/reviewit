import mongoose, { Schema, models } from "mongoose";

export const LocalSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  roadAddress: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  categoryCode: {
    type: String,
  },
  mapx: {
    type: Number,
    required: true,
  },
  mapy: {
    type: Number,
    required: true,
  },
  telephone: {
    type: String,
  },
  link: {
    type: String,
  },
  registerDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
  },
});

const Local = models?.Local ?? mongoose.model("Local", LocalSchema);

export default Local;
