const jwt = require('jsonwebtoken')
const sender = require('./sender')

exports.sign = function (userInfo, expiresIn) {
	return jwt.sign(userInfo, process.env.JWT_TOKEN_PHRASE || '', {
		expiresIn: Number(expiresIn || process.env.JWT_TOKEN_EXPIRES_IN || 86400),
	})
}

// resolve token to object data
exports.verify = (token) =>
	new Promise((resolve, reject) => {
		if (token) {
			jwt.verify(
				token,
				process.env.JWT_TOKEN_PHRASE,
				{ algorithms: ['HS256', 'HS384'] },
				(err, decoded) => {
					if (err) {
						reject('Failed or expired token')
					} else {
						resolve(decoded)
					}
				}
			)
		} else {
			reject('No token provided')
		}
	})

exports.newAuthCode = (username) =>
	new Promise((resolve, reject) => {
		db.authCodes.updateMany(
			{ username: username, verified: false, passive: false },
			{ $set: { passive: true } },
			{ multi: true }
		)
		let newDoc = new db.authCodes({
			username: username,
			authCode: util.randomNumber(120040, 997180).toString(),
			authCodeExpire: new Date().setSeconds(
				new Date().getSeconds() + (config('AUTHCODE_EXPIRE') || 180)
			),
		})
		newDoc.save().then(resolve).catch(reject)
	})

exports.sendAuthCode = (username) =>
	new Promise((resolve, reject) => {
		exports
			.newAuthCode(username)
			.then((newDoc) => {
				if (util.isValidTelephone(username)) {
					sender
						.sendAuthSms(username, newDoc.authCode)
						.then(resolve)
						.catch(reject)
				} else if (util.isValidEmail(username)) {
					sender
						.sendAuthEmail(username, newDoc.authCode)
						.then(resolve)
						.catch(reject)
				} else {
					resolve()
				}
			})
			.catch(reject)
	})
