const mongoose = require('../db/db');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: Number, default: 0 },
  email: { type: String, default: '' },
  signature: { type: String, default: '' },
  blog_address: { type: String, default: '' },
  user_photo: { type: String, default: '' },
  blog_category: [
    {
      name: { type: String },
      blog_tag: [
        {
          name: { type: String }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
