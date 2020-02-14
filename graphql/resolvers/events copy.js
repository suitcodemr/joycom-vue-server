const Event = require('../../models/Event');

module.exports = {
	Query: {
		async getEvent(_, { eventId }) {
			console.log('getEvent');
			try {
				const event = await Event.findById(eventId);
				return event;
			} catch (err) {
				throw new Error(err);
			}
		}
	},
	Mutation: {
		async createEvent(
			_,
			{
				eventInput: { name, location, time, duration, body, maxUsers, category }
			},
			context
		) {
			console.log('createEvent');
			const user = checkAuth(context);
			const { errors, valid } = validateEventInput(
				name,
				location,
				time,
				duration,
				body,
				maxUsers,
				category
			);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}
			const eventTemp = await Event.findOne({ name });
			if (eventTemp) {
				throw new UserInputError(
					'Das Event mit dem Namen existiert bereits...',
					{
						errors: {
							name: 'Das Event mit dem Namen existiert bereits...'
						}
					}
				);
			}
			const tempUserList = [];
			tempUserList.unshift({
				_id: user._id,
				username: user.username,
				avatar: user.avatar
			});

			const newEvent = new Event({
				name,
				location,
				time,
				duration,
				body,
				maxUsers,
				category,
				creator: user.username,
				userList: tempUserList
			});
			const res = await newEvent.save();

			const categoryTemp = await Category.find({ name: category });

			if (categoryTemp) {
				categoryTemp[0].events.unshift({
					_id: res._doc._id
				});
				await categoryTemp[0].save();
			} else throw new UserInputError('Kategorie nicht gefunden');

			return {
				...res._doc
			};
		}
	}
};
