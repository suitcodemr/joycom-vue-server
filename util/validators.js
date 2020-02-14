module.exports.validateRegisterInput = (
	username,
	email,
	password,
	confirmPassword
) => {
	const errors = {};
	if (username.trim() === '') {
		errors.username = 'Bitte geben Sie einen Benutzernamen an.';
	}
	if (email.trim() === '') {
		errors.email = 'Bitte geben Sie eine Email an.';
	} else {
		const regEx =
		/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			errors.email = 'Ihre angegebene Email ist keine gültige Email-Adresse!';
		}
	}
	if (password.trim() === '') {
		errors.password = 'Bitte geben Sie ein Passwort an.';
	} else if (password !== confirmPassword) {
		errors.confirmPassword = 'Die Passwörter stimmen nicht überein!';
	}
	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};

module.exports.validateLoginInput = (username, password) => {
	const errors = {};
	if (username.trim() === '') {
		errors.username = 'Bitte geben Sie einen Benutzernamen an.';
	}
	if (password.trim() === '') {
		errors.password = 'Bitte geben Sie ein Passwort an.';
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};

module.exports.validateEventInput = (
	name,
	location,
	time,
	duration,
	body,
	maxUsers,
	category
) => {
	const errors = {};
	if (name.trim() === '') {
		errors.name = 'Bitte geben Sie dem Event einen Namen.';
	}
	if (location.trim() === '') {
		errors.location = 'Bitte geben Sie einen Ort an.';
	}
	if (time.trim() === '') {
		errors.time =
			'Bitte geben Sie eine Uhrzeit an ,wann das Event starten soll.';
	}
	if (duration.trim() === '') {
		errors.duration = 'Bitte geben Sie eine Dauer des Events an';
	}
	if (body.trim() === '') {
		errors.body = 'Bitte geben Sie eine kurze Beschreibung für das Event an.';
	}
	if (maxUsers.trim() === '') {
		errors.maxUsers = 'Sie müssen mindestens eine Person angeben.';
	} else {
		const regEx = /^[1-9]*$/;
		if (!maxUsers.match(regEx)) {
			errors.maxUsers =
				'Es sind nur Zahlen erlaubt und 0 Personen gibt es nicht ;)';
		}
	}
	if (category.trim() === '') {
		errors.category = 'Bitte geben Sie eine Kategorie an.';
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};
