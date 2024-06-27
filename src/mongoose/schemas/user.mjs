import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  upvotedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
});

export const User = mongoose.model("User", UserSchema);
