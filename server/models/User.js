const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, trim: true, maxlength: 3 },
    jobTitle: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
