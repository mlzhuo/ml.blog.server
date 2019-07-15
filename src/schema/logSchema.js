const mongoose = require('../db/db');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const logSchema = new Schema({
  user_id: { type: ObjectId, required: true },
  type: { type: Number, required: true },
  date: { type: Date, default: new Date().toISOString() },
  ip: { type: String, default: '' }
});

module.exports = mongoose.model('Log', logSchema);
