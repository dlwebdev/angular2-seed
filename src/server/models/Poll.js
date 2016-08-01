'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const mongoose = require('mongoose');
const _mongoose2 = _interopRequireDefault(mongoose);

const Schema = mongoose.Schema;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pollSchema = new Schema({
  name: String,
  creatorId: String,
  options: Array,
  dateAdded: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

exports.default = _mongoose2.default.model('Poll', pollSchema);