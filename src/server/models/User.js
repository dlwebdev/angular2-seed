'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const mongoose = require('mongoose');
const _mongoose2 = _interopRequireDefault(mongoose);

const Schema = mongoose.Schema;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a schema for the Todo object
const userSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  polls: [{type: Schema.Types.ObjectId, ref: 'Poll'}]
});
// Expose the model so that it can be imported and used in the controller (to search, delete, etc)
// src/models/Poll.js
exports.default = _mongoose2.default.model('User', userSchema);