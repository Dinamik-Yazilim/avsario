module.exports = (req) =>
	new Promise(async (resolve, reject) => {
		try {
			if (!req.params.param1) return reject(`param1 required`)

			if (req.params.param1 == 'username') {
				checkUsername(req.params.param2 || req.getValue('username'))
					.then(resolve)
					.catch(reject)

			} else if (req.params.param1 == 'organization') {
				checkOrganization(req.params.param2 || req.getValue('organization'))
					.then(resolve)
					.catch(reject)
			} else {
				return reject(`wrong parameter. /auth/check/username/:[email | phoneNumber] | /auth/check/organization/:organizationName`)
			}

		} catch (err) {
			reject(err)
		}
	})

function checkUsername(username) {
	return new Promise(async (resolve, reject) => {
		if (username.includes('@')) {
			username = username.trim()
		} else if (!isNaN(username)) {
			username = util.fixPhoneNumber(username)
		} else {
			return reject('username error')
		}
		const userDoc = await db.members.findOne({ username: username })
		if (userDoc == null) {
			resolve({ inUse: false })
		} else if (userDoc.passive) {
			reject(`Kullanici aktif degil. Sistem yöneticisine başvurun.`)
		} else {
			resolve({ inUse: true, role: userDoc.role })
		}
	})
}


function checkOrganization(orgName) {
	return new Promise(async (resolve, reject) => {
		orgName = util.fixOrganizationName(orgName)
		const orgDoc = await db.organizations.findOne({ name: orgName })
		if (orgDoc == null) {
			resolve({ inUse: false })
		} else if (orgDoc.passive) {
			reject(`organizasyon aktif degil. Sistem yöneticisine başvurun.`)
		} else {
			resolve({ inUse: true, name: orgDoc.name })
		}

	})

}