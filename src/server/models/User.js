var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {type: String, required: true},
	email: {type: String},
	twitter: Array,
	polls: [{type: Schema.Types.ObjectId, ref: 'Poll'}]
});

module.exports = mongoose.model('User', UserSchema);
