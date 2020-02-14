const { model, Schema } = require('mongoose');

const categorySchema = new Schema({
	name: String,
	events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = model('Category', categorySchema);
