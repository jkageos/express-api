import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  estimatedReadTime: { type: Number, required: true },
  picture: { type: String },
  video: { type: String },
  upvotes: { type: Number, default: 0 },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Blog = mongoose.model("Blog", blogSchema);
