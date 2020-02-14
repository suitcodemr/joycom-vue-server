const Event = require('../../models/Event');
const Category = require('../../models/Category');

const {
	UserInputError,
	AuthenticationError
} = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const { validateEventInput } = require('../../util/validators');

module.exports = {
	Query: {
		async getEvent(_, { eventId }) {
			try {
				const event = await Event.findById(eventId);
				return event;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getEvents() {
			console.log('getEvents');
			try {
				const events = await Event.find().sort({ createdAt: -1 });
				return events;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getEventsCategory(_, { categoryId }) {
			console.log('getEventsCategory');

			const category = await Category.findById(categoryId);
			const { name } = category._doc;

			try {
				const events = await Event.find({ category: name });
				return events;
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
		},
		async deleteEvent(_, { eventId }, context) {
			console.log('deleteEvent');
			const user = checkAuth(context);

			try {
				//GET event
				const event = await Event.findById(eventId);
				const { creator, category } = event;

				//GET category
				const categoryTemp = await Category.find({ name: category });
				const categoryArray = categoryTemp[0].events;
				const eventIndex = categoryArray.findIndex(
					event => event._id.toString() === eventId
				);

				if (user.username === creator) {
					categoryArray.splice(eventIndex, 1);
					await categoryTemp[0].save();
					await event.delete();

					return 'Das Event wurde erfolgreich entfernt';
				} else {
					throw new AuthenticationError(
						'Sie haben nicht die befugnis das Event zu löschen!'
					);
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		async addUser(_, { eventId }, context) {
			console.log('addUser');
			const user = checkAuth(context);

			try {
				//GET event
				const event = await Event.findById(eventId);
				const { userList, creator, userCount } = event;
				const userIndex = userList.findIndex(
					arrayElement => arrayElement._id.toString() === user._id
				);

				if (event) {
					if (userIndex > -1) {
						//User nimmt schon am Event teil.
						userList.splice(userIndex, 1);
					} else {
						//User nimmt noch nicht am Event teil.
						userList.unshift({
							_id: user._id,
							username: user.username,
							avatar: user.avatar
						});
					}
					await event.save();
					return event;
				} else {
					return 'Das Event wurde nicht gefunden.';
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		async likeEvent(_, { eventId }, context) {
			console.log('likePost');

			const { username } = checkAuth(context);

			const event = await Event.findById(eventId);

			if (event) {
				if (event.likes.find(like => like.username === username)) {
					//Event ist geliket, unlike es
					event.likes = event.likes.filter(like => like.username !== username);
				} else {
					event.likes.push({
						username,
						createdAt: new Date().toISOString()
					});
				}
				await event.save();
				return event;
			} else {
				throw new UserInputError('Event wurde nicht gefunden');
			}
		}
	}
};
