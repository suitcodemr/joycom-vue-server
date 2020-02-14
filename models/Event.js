const { model, Schema } = require('mongoose');

const eventSchema = new Schema({
	name: String,
	location: String,
	time: String,
	duration: String,
	body: String,
	creator: String,
	category: String,
	userList: [
		{
			username: String,
			avatar: String
		}
	],
	maxUsers: String,
	likes: [
		{
			username: String,
			createdAt: String
		}
	],
	comments: [
		{
			body: String,
			username: String,
			createdAt: String
		}
	]
});
module.exports = model('Event', eventSchema);

