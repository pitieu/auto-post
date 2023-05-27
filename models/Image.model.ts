import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export const imageSchema = new mongoose.Schema(
  {
    fid: { type: Number, unique: true },
    url: { type: String, unique: true },
    image: { type: String, unique: true },
    name: { type: String },
    published: { type: Boolean },
  },
  { timestamps: true }
);
imageSchema.plugin(uniqueValidator);

const Image = mongoose.model("Image", imageSchema);

export default Image;
