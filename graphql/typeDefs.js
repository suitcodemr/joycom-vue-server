const { gql } = require('apollo-server-express');

module.exports = gql`
	type User {
		_id: ID!
		username: String!
		email: String!
		password: String!
		avatar: String!
		token: String!
		createdAt: String!
		updatedAt: String!
	}
	input RegisterInput {
		username: String!
		email: String!
		password: String!
		confirmPassword: String!
		avatar: String!
	}
	type Category {
		_id: ID!
		name: String!
		events: [Event]!
		eventCount: Int!
	}
	type Event {
		_id: ID!
		name: String!
		location: String!
		time: String!
		duration: String!
		body: String!
		creator: String!
		userList: [User]!
		maxUsers: String!
		category: String!
		userCount: Int!
		likes: [Like]!
		likeCount: Int!
		comments: [Comment]!
		commentCount: Int!
	}
	input EventInput {
		name: String!
		location: String!
		time: String!
		duration: String!
		body: String!
		maxUsers: String!
		category: String!
	}
	type Like {
		_id: ID!
		username: String!
		createdAt: String!
	}
	type Comment {
		_id: ID!
		createdAt: String!
		username: String!
		body: String!
	}
	# Das Schema erlaubt folgende query's:
	type Query {
		getUsers: [User]
		getUser(userId: ID!): User
		getCategory(category: String!): Category
		getCategories: [Category]
		getEvent(eventId: ID!): Event
		getEvents: [Event]
		getEventsCategory(categoryId: ID!): [Event]
	}

	# Das Schema erlaubt folgende mutation's:
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		createCategory(name: String!): Category!
		createEvent(eventInput: EventInput): Event!
		deleteEvent(eventId: ID!): String!
		addUser(eventId: ID!): Event!
		likeEvent(eventId: ID!): Event!
		createComment(eventId: ID!, body: String!): Event!
		deleteComment(eventId: ID!, commentId: ID!): Event!
	}
`;