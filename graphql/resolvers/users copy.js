const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const User = require('../../models/User');
const { validateRegisterInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const generateToken = user => {
	return jwt.sign(
		{
			_id: user._id,
			email: user.email,
			username: user.username,
			avatar: user.avatar
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
};

module.exports = {
	Mutation: {
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword, avatar } }
		) {
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError('Der Benutzername existiert bereits.', {
					errors: {
						username: 'Der Benutzername existiert bereits.'
					}
				});
			}
			password = await bcrypt.hash(password, 12);
			const newUser = new User({
				username,
				email,
				password,
				avatar
			});
			const result = await newUser.save();
			const token = generateToken(result);
			return {
				...result._doc,
				token,
				createdAt: result.createdAt.toISOString(),
				updatedAt: result.updatedAt.toISOString()
			};
		}
	}
};


