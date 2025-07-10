String.prototype.padding = function (n, c) {
	var val = this.valueOf()
	if (Math.abs(n) <= val.length) {
		return val
	}
	var m = Math.max((Math.abs(n) - this.length) || 0, 0)
	var pad = Array(m + 1).join(String(c || ' ').charAt(0))
	return (n < 0) ? pad + val : val + pad
}

Number.prototype.toDigit = function (digit) {
	var t = this
	var s = t.toString()
	if (s.length < digit) {
		s = '0'.repeat(digit - s.length) + s
	}
	return s
}



Date.prototype.yyyymmddhhmmss = function (middleChar = ' ', removeTimeOffset = false) {
	let d = new Date(this.valueOf())
	if (removeTimeOffset) {
		d.setMinutes(d.getMinutes() + (new Date()).getTimezoneOffset())
	}

	return `${d.getFullYear()}-${(d.getMonth() + 1).toDigit(2)}-${d.getDate().toDigit(2)}${middleChar}${d.getHours().toDigit(2)}:${d.getMinutes().toDigit(2)}:${d.getSeconds().toDigit(2)}`
}


Date.prototype.addDays = function (days) {
	var dat = new Date(this.valueOf())
	dat.setDate(dat.getDate() + days)
	return dat
}

Date.prototype.add = function (interval, units) {
	var dat = new Date(this.valueOf())
	return exports.dateAdd(dat, interval, units)
}

exports.dateAdd = function (date, interval, units) {
	if (!(date instanceof Date))
		return undefined
	let ret = new Date(date) //don't change original date
	let checkRollover = function () {
		if (ret.getDate() != date.getDate())
			ret.setDate(0)
	}
	switch (String(interval).toLowerCase()) {
		case 'year':
			ret.setFullYear(ret.getFullYear() + units)
			checkRollover()
			break
		case 'quarter':
			ret.setMonth(ret.getMonth() + 3 * units)
			checkRollover()
			break
		case 'month':
			ret.setMonth(ret.getMonth() + units)
			checkRollover()
			break
		case 'week':
			ret.setDate(ret.getDate() + 7 * units)
			break
		case 'day':
			ret.setDate(ret.getDate() + units)
			break
		case 'hour':
			ret.setTime(ret.getTime() + units * 3600000)
			break
		case 'minute':
			ret.setTime(ret.getTime() + units * 60000)
			break
		case 'second':
			ret.setTime(ret.getTime() + units * 1000)
			break
		default:
			ret = undefined
			break
	}
	return ret
}

Date.prototype.lastThisMonth = function () {
	let dat = new Date(this.valueOf())
	dat = new Date((new Date(dat.setMonth(dat.getMonth() + 1))).setDate(0))
	return dat
}

global.eventLog = function (obj, ...placeholders) {
	console.log(new Date().yyyymmddhhmmss(), obj, ...placeholders)
}

global.errorLog = function (obj, ...placeholders) {
	console.error(new Date().yyyymmddhhmmss().red, obj, ...placeholders)
}

global.warnLog = function (obj, ...placeholders) {
	console.error(new Date().yyyymmddhhmmss().yellow, obj, ...placeholders)
}


global.devLog = (...props) => {
	if (process.env.NODE_ENV === 'development') {
		eventLog(...props)
	}
}

global.devError = (...props) => {
	if (process.env.NODE_ENV === 'development') {
		errorLog(...props)
	}
}

global.printLine = (output) => {
	process.stdout.write(`\r${output}`)


	// console.log(params, ...other)
	// process.stdout.write("\n")
}

exports.moduleLoader = (folder, suffix) => {
	return new Promise((resolve, reject) => {
		try {
			let holder = {}
			let files = fs.readdirSync(folder)
			files.forEach((e) => {
				let f = path.join(folder, e)
				if (!fs.statSync(f).isDirectory()) {
					let fileName = path.basename(f)
					let apiName = fileName.substr(0, fileName.length - suffix.length)
					if (apiName != '' && !apiName.startsWith('!') && (apiName + suffix) == fileName) {
						holder[apiName] = require(f)
					}
				}
			})
			resolve(holder)
		} catch (err) {
			reject(err)
		}
	})
}

exports.randomNumber = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}


exports.isValidFileName = function (fileName) {
	return /^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\\:<>/$"]*[^\\:<>/$"]+$/.test(fileName)
}

exports.isValidEmail = function (s) {
	return /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(s)
}

exports.isValidTelephone = function (tel) {
	if (tel.trim() === '') return false
	for (var i = 0; i < tel.length; i++) {
		if (!((tel[i] >= '0' && tel[i] <= '9') || tel[i] === '+')) {
			return false
		}
	}
	return true
}


exports.fixPhoneNumber = (phoneNumber) => {
	let phone = phoneNumber
	phone = phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('.', '').replaceAll('+', '').replaceAll('(', '').replaceAll(')', '')
	if (phone.substring(0, 1) == '0') phone = phone.substring(1)
	if (phone.length == 10) phone = '90' + phone

	return phone
}

exports.clone = function (obj) {
	if (Array.isArray(obj) || typeof obj === 'object') {
		return JSON.parse(JSON.stringify(obj))
	} else {
		return obj
	}
}

exports.htmlEval = function (html, values = {}) {
	let code = ''
	try {

		Object.keys(values).forEach((key) => {
			if (key != 'class')
				code += `const ${key}=${JSON.stringify(values[key])}\n`
		})
		code += `return \`${html}\``
		let f = new Function(code)
		return f()
	} catch (tryErr) {
		console.log('[htmlEval] tryErr:', tryErr)
	}
	return html
}

exports.maskName = function (name) {
	var regex = /\b(\w{2})\w+(\w)\b/g
	return name.replace(regex, '$1**$2')
}

exports.listObjectToObject = function (listObj) {
	if (typeof listObj != 'object' || listObj == null)
		return listObj
	let obj = {}

	function calistir(anaObj, keys, parentKey = '') {
		if (anaObj[keys[0]] == undefined) {
			anaObj[keys[0]] = {}
			if (keys.length > 1) {
				if (!isNaN(keys[1])) {
					anaObj[keys[0]] = []
				}
			}
		}
		if (keys.length == 1) {
			anaObj[keys[0]] = listObj[`${(parentKey ? parentKey + '.' : '')}${keys[0]}`]

		} else {
			let key = keys[0]
			parentKey += (parentKey ? '.' : '') + key
			keys.splice(0, 1)
			calistir(anaObj[key], keys, parentKey)
		}
	}

	Object.keys(listObj).forEach((mainKey) => {
		let a = calistir(obj, mainKey.split('.'))
		obj = Object.assign({}, obj, a)
	})

	return obj
}

exports.objectToListObject = function (objOrj, exceptArrays = false) {
	let listObj = {}
	if (objOrj == undefined || objOrj == null)
		return listObj

	function calistir(obj, parentKey) {
		if (Array.isArray(obj) && exceptArrays) {
			if (parentKey != '') {
				listObj[parentKey] = obj
			}
		} else if (typeof obj == 'object') {
			Object.keys(obj || {}).forEach((key) => {
				let key2 = (parentKey ? parentKey + '.' : '') + key
				calistir(obj[key], key2)
			})
		} else {
			if (parentKey != '') {
				listObj[parentKey] = obj
			}
		}
	}

	calistir(objOrj)

	return listObj
}

exports.convertDate = function (textDate) {

	let timezone = new Date().getTimezoneOffset()
	let tarih = new Date(textDate)
	tarih.setMinutes(tarih.getMinutes() + -1 * timezone)
	return tarih
}


exports.JSON_to_URLEncoded = function (element, key, list) {
	var list = list || []
	if (typeof (element) == 'object') {
		for (var idx in element)
			exports.JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list)
	} else {
		list.push(key + '=' + encodeURIComponent(element))
	}
	return list.join('&')
}

exports.cemalize = function (text) {
	var rg = /(^\w{1}|\.\s*\w{1}|\s\s*\w{1})/gi
	text = text.replace(rg, function (toReplace) {
		return toReplace.toUpperCase()
	})
	return text
}

exports.yesterday = function () {
	return new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substring(0, 10)
}
exports.fixOrganizationName = function (name) {
	name = name.toLowerCase()
		.replaceAll('İ', 'i')
		.replaceAll('I', 'i')
		.replaceAll('ı', 'i')
		.replaceAll('Ü', 'u')
		.replaceAll('ü', 'u')
		.replaceAll('ş', 's')
		.replaceAll('Ş', 's')
		.replaceAll('ğ', 'g')
		.replaceAll('Ğ', 'g')
		.replaceAll('Ö', 'o')
		.replaceAll('ö', 'o')
		.replaceAll('Ç', 'c')
		.replaceAll('ç', 'c')
	name = name.replace(/[^a-z,0-9]+/, '')
	return name
}

exports.pad = function (num, size) {
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}

exports.yyyyMMdd = function (tarih) {
	// let t = new Date(tarih)
	// t.setMinutes(t.getMinutes() + (-1 * new Date().getTimezoneOffset()))
	// let sonuc = t.toISOString().substring(0, 10).replaceAll('-', '')
	if (typeof tarih == 'string') {
		let s = tarih.substring(0, 10).replaceAll('-', '')
		return s
	} else {
		let t = new Date(tarih)
		t.setHours(11)
		return t.toISOString().substring(0, 10).replaceAll('-', '')
	}

	// console.log('yyyyMMdd:', s, 'tarih:', tarih)

}
