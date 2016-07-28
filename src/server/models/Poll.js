'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const mongoose = require('mongoose');
const _mongoose2 = _interopRequireDefault(mongoose);

const Schema = mongoose.Schema;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a schema for the Todo object
const pollSchema = new Schema({
  name: String,
  creatorId: String,
  options: Array,
  dateAdded: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});
// Expose the model so that it can be imported and used in the controller (to search, delete, etc)
// src/models/Poll.js
exports.default = _mongoose2.default.model('Poll', pollSchema);