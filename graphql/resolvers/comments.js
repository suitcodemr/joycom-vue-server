const {
	AuthenticationError,
	UserInputError
} = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Event = require('../../models/Event');

module.exports = {
	Mutation: {
		async createComment(_, { eventId, body }, context) {
			console.log('createComment');

			const { username } = checkAuth(context);

			if (body.trim() === '') {
				throw new UserInputError('Kommentar ist leer!', {
					errors: {
						body: 'Sie können keinen leeren Kommentar schicken!'
					}
				});
			}

			const event = await Event.findById(eventId);
			if (event) {
				event.comments.unshift({
					body,
					username,
					createdAt: new Date().toISOString()
				});
				await event.save();
				return event;
			} else {
				throw new UserInputError('Das Event existiert nicht!');
			}
		},
		async deleteComment(_, { eventId, commentId }, context) {
			console.log('deleteComment');

			const { username } = checkAuth(context);

			const event = await Event.findById(eventId);

			if (event) {
				const commentIndex = event.comments.findIndex(
					comment => comment._id.toString() === commentId
				);
				console.log(commentIndex);

				if (event.comments[commentIndex].username === username) {
					event.comments.splice([commentIndex], 1);
					await event.save();
					return event;
				} else {
					throw new AuthenticationError(
						'Sie haben nicht die Berechtigung den Kommentar zu löschen!'
					);
				}
			} else {
				throw new UserInputError('Das Event existiert nicht!');
			}
		}
	}
};
