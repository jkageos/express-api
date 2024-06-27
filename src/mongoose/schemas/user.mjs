import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
// 	username: {
// 		type: mongoose.Schema.Types.String,
// 		required: true,
// 		unique: true,
// 	},
// 	displayName: mongoose.Schema.Types.String,
// 	password: {
// 		type: mongoose.Schema.Types.String,
// 		required: true,
// 	},
// });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  upvotedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
});

// {
//   "username": "johndoe",
//   "email": "johndoe@example.com",
//   "password": "securepassword123",
//   "bookmarks": ["60d5ecb54b24e736f0cfffb1", "60d5ecb54b24e736f0cfffb2"],
//   "upvotedBlogs": ["60d5ecb54b24e736f0cfffb3", "60d5ecb54b24e736f0cfffb4"]
// }

export const User = mongoose.model("User", UserSchema);
