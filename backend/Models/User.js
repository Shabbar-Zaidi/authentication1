const mongoose = require("mongoose"); // Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It is used to model your data and interact with MongoDB in a more structured way.
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("users", UserSchema); // 'users' is the name of the collection in MongoDB where user documents will be stored. Mongoose will automatically create a collection named 'users' if it doesn't exist.
module.exports = UserModel;
