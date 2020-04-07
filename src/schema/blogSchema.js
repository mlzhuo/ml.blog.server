const mongoose = require('../db/db')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const blogSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, default: new Date().toISOString() },
  edit_date: { type: Date },
  content: { type: String, required: true },
  is_delete: { type: Number, required: true, default: 0 },
  state: { type: Number, required: true, default: 0 },
  user_id: { type: String, require: true },
  category_id: { type: String, require: true },
  tag_id: { type: String, require: true },
  view: { type: Number, required: true, default: 0 },
  like: { type: Number, required: true, default: 0 },
  custom_tag: { type: String }
})

module.exports = mongoose.model('Blog', blogSchema)
