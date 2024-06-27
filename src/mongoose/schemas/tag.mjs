import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const Tag = mongoose.model("Tag", tagSchema);
