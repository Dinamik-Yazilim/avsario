const auth = require('../../lib/auth')
const { ObjectId } = require('mongodb')
exports.saveSession = async function (organizationDoc, memberDoc, req, loginProvider = 'dinamikup', oauth2 = null) {
	let deviceId = req.getValue('deviceId') || ''
	let lang = req.getValue('lang') || ''
	let oldSessions = []
	try {
		oldSessions = await db.sessions
			.find({ member: memberDoc._id })
			.sort({ _id: -1 })
			.limit(1)


		await db.sessions.updateMany(
			{ member: memberDoc._id, deviceId: deviceId, closed: false },
			{ $set: { closed: true } },
			{ multi: true }
		)

	} catch (err) {
		console.error('saveSession err:', err)
	}

	return new Promise(async (resolve, reject) => {
		try {
			let oldDbId = ''

			if (oldSessions.length > 0) {
				if (!lang) lang = oldSessions[0].lang
				oldDbId = oldSessions[0].db
				// oldDbList = oldSessions[0].dbList
			}
			if (oldDbId == null && dbList.length > 0) {
				oldDbId = dbList[0]._id
			}
			let sessionDoc = new db.sessions({
				organization: organizationDoc._id,
				member: memberDoc._id,
				loginProvider: loginProvider,
				role: memberDoc.role,
				db: oldDbId,
				// dbList: oldDbList || [],
				deviceId: deviceId,
				IP: req.IP || '',
				lastIP: req.IP || '',
				closed: false,
				lang: lang || 'tr',
				oauth2: oauth2,
				requestHeaders: req.headers
			})

			sessionDoc
				.save()
				.then(async (newDoc) => {
					let obj = {
						token: 'DINAMIKUP_' + auth.sign({ sessionId: newDoc._id.toString() }),
						db: newDoc.db,
						lang: newDoc.lang,
						user: memberDoc.toJSON(),
					}
					delete obj.user.password
					resolve(obj)
				})
				.catch(reject)
		} catch (err) {
			reject(err)
		}

	})
}
