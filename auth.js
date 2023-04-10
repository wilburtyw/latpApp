// use bcrypt to hash passwords
const bcrypt = require('bcryptjs');

const {User, Settings, UserSettings} = require('./db.js')

// function to register new users
function register(username, email, password, errorCallback, successCallback) {
		// check if user already exists
		User.findOne({email: email},(err, result, count) => {
			if (result) {
				console.log(`User with email ${user.email} has been registered`);
				errorCallback({message: 'USERNAME ALREADY EXISTS'});
			} else {
				// hash passwords to prevent leak
				bcrypt.hash(password, 10, function(err, hash) {
					// create new user
					new User({
						username: username,
						email: email,
						password: hash,
						actions: [],
					}).save(function(err, user, count){
						if (err) {
							console.log(count);
							console.log('document save error!');
							errorCallback({message: 'DOCUMENT SAVE ERROR'});
						} else {
							successCallback(user);
						}
					});
				});
			}
		});
}

// function to check login credentials
function login(email, password, errorCallback, successCallback) {
	User.findOne({email: email}, (err, user, count) => {
		if (!err) {
			// unhash passwords using bcrypt
			bcrypt.compare(password, user.password, (err, passwordMatch) => {
				if (passwordMatch) {
					successCallback(user);
				} else {
					console.log('passwords do not match!');
					errorCallback({message: 'PASSWORDS DO NOT MATCH'});
				}
			});
		} else {
			console.log(err);
			errorCallback({message: 'INVALID NAME OR PASSWORD'});
		}
	});
}

// creating a new authenticated session for a user
// regenerating the session ID to prevent session fixation attacks.
function startAuthenticatedSession(req, user, callback) {
	req.session.regenerate((err) => {
		if (!err) {
			req.session._id = user;
			callback();
		} else {
			callback(err);
		}
	});
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};