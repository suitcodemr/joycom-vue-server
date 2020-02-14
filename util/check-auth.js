const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { SECRET_KEY } = require('../config');

module.exports = context => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];
		if (token) {
			try {
				const user = jwt.verify(token, SECRET_KEY);
				return user;
			} catch (err) {
				throw new AuthenticationError({ message: ' Ungültiger token' });
			}
		}
		throw new Error(
			"Der Authentifizierungstoken muss folgend zusammengesetzt sein: 'Bearer [token]'."
		);
	}
	throw new Error(
		"Der Authentifizierungstoken muss im 'header' bereitgestellt sein."
	);
};