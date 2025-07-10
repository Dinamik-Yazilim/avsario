module.exports = (dbModel, sessionDoc, req) => new Promise(async (resolve, reject) => {
	try {
		if (!sessionDoc) {
			return restError.session(req, reject)
		}

		switch (req.method) {
			case 'GET':
				getMyProfile(dbModel, sessionDoc, req).then(resolve).catch(reject)
				break
			case 'PUT':
			case 'POST':
				if (req.params.param1 == 'changePassword') {
					changePassword(dbModel, sessionDoc, req).then(resolve).catch(reject)
				} else {
					updateMyProfile(dbModel, sessionDoc, req).then(resolve).catch(reject)
				}

				break
			default:
				restError.method(req, reject)
				break
		}
	} catch (err) {
		reject(err)
	}
})

function changePassword(dbModel, sessionDoc, req) {
	return new Promise(async (resolve, reject) => {
		try {

			let oldPassword = req.getValue('oldPassword')
			let newPassword = req.getValue('newPassword')


			if (!newPassword) return reject('new password required')
			if (newPassword.length < 8) return reject('password must be at least 8 characters')
			let memberDoc = await dbModel.members.findOne({ _id: sessionDoc.member }).select('_id password')
			if (memberDoc.password && !oldPassword) return reject('old password required')

			if ((memberDoc.password || '') != oldPassword) {
				return reject(`incorrect old password`)
			}
			memberDoc.password = newPassword
			memberDoc
				.save()
				.then(() => resolve(`your password has been changed successfuly`))
				.catch(reject)
		} catch (err) {
			reject(err)
		}

	})
}

function getMyProfile(dbModel, sessionDoc, req) {
	return new Promise(async (resolve, reject) => {
		try {
			let doc = await dbModel.members
				.findOne({ _id: sessionDoc.member })
				.populate([{
					path: 'organization',
					select: '_id name'
				}])
				.select('-password')

			if (doc) {
				let obj = doc.toJSON()
				obj.session = {
					sessionId: sessionDoc._id,
					lang: sessionDoc.lang,
					db: sessionDoc.db,
				}

				resolve(obj)
			} else
				reject('user not found')
		} catch (err) {
			reject(err)
		}
	})

}
function updateMyProfile(dbModel, sessionDoc, req) {
	return new Promise(async (resolve, reject) => {
		let doc = await dbModel.members.findOne({ _id: sessionDoc.member })
		if (!doc)
			return reject('oturuma ait kullanıcı bulunamadı')
		let data = req.body || {}
		delete data._id
		delete data.password
		delete data.role
		delete data.passive
		delete data.createdDate
		delete data.modifiedDate

		let newDoc = Object.assign(doc, data)
		if (!epValidateSync(newDoc, reject)) return

		newDoc.fullName = (doc.firstName || '') + ' ' + (doc.lastName || '')
		newDoc.save()
			.then((doc2) => {
				let obj = doc2.toJSON()
				delete obj.password

				resolve(obj)
			})
			.catch(reject)
	})
}