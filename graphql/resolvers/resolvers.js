const usersResolvers = require('./users');
const categoriesResolvers = require('./categories');
const eventsResolvers = require('./events');
const commentsResolvers = require('./comments');

module.exports = {
	Category: {
		eventCount: parent => parent.events.length
	},
	Event: {
		userCount: parent => parent.userList.length,
		likeCount: parent => parent.likes.length,
		commentCount: parent => parent.comments.length
	},
	Query: {
		...usersResolvers.Query,
		...categoriesResolvers.Query,
		...eventsResolvers.Query
	},
	Mutation: {
		...usersResolvers.Mutation,
		...categoriesResolvers.Mutation,
		...eventsResolvers.Mutation,
		...commentsResolvers.Mutation
	}
};
