import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  tuit: String,
  likes: Number,
  liked: Boolean,
}, {collection: 'tuits'});
export default schema;