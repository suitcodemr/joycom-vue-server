const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');

const User = require('../../models/User');

const {
	validateRegisterInput,
	validateLoginInput
} = require('../../util/validators');
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
	Query: {
		async getUsers() {
			console.log('getUsers');
			try {
				const users = await User.find().sort({ createdAt: -1 });
				return users.map(user => {
					return {
						...user._doc,
						createdAt: user.createdAt.toISOString(),
						updatedAt: user.updatedAt.toISOString()
					};
				});
			} catch (err) {
				throw new Error(err);
			}
		},
		async getUser(_, { userId }) {
			console.log('getUser');

			try {
				const user = await User.findById(userId);
				if (user) {
					return {
						...user._doc,
						createdAt: user.createdAt.toISOString(),
						updatedAt: user.updatedAt.toISOString()
					};
				} else {
					throw new Error('Der Benutzer wurde nicht gefunden.');
				}
			} catch (err) {
				throw new Error(err);
			}
		}
	},
	Mutation: {
		async login(_, { username, password }) {
			console.log('login');

			const { valid, errors } = validateLoginInput(username, password);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ username });

			if (!user) {
				errors.general = 'Benutzername existiert nicht!';
				throw new UserInputError('Benutzername existiert nicht!', { errors });
			}

			const comparePassword = await bcrypt.compare(password, user.password);
			if (!comparePassword) {
				errors.general = 'Falsches Passowort';
				throw new UserInputError('Falsches Passwort', { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				token,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString()
			};
		},

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
