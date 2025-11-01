// // models/User.js
// const userSchema = new Schema({
//   userId: { type: String, unique: true, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true }, // bcrypt hashed
//   fullName: String,
//   createdAt: { type: Date, default: Date.now },
//   lastLogin: Date,
//   role: { type: String, enum: ['patient', 'doctor'], required: true }
// });


// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  role: { type: String, enum: ['patient', 'doctor'], required: true }
});

module.exports = mongoose.model('User', userSchema);
