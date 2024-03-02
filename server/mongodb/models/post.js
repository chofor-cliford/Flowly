import mongoose from "mongoose";
const { models, model } = mongoose;

const Post = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
});

const PostSchema = models?.Post || model("User", Post);

export default PostSchema;
