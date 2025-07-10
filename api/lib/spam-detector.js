var ipList = {}

module.exports = (ipAddress, userOptions) => {
  var options = {
    suspendInterval: process.env.SPAM_DETECTOR_SUSPEND_INTERVAL || 1800    // default 30min
  }
  Object.assign(options, userOptions || {})
  // devLog('ipAddress',ipAddress)
  // devLog(`ipList`, ipList)

  let t = (new Date()).getTime()
  if (ipList[ipAddress] && ipList[ipAddress].suspended.getTime() > t) {
    let diffSeconds = Math.ceil((ipList[ipAddress].suspended.getTime() - t) / 1000)
    // return diffSeconds
    return false
  }


  if (ipList[ipAddress] == undefined) {
    ipList[ipAddress] = {
      attemptCount: 1,
      firstAttempt: new Date(),
      suspended: dateAddSecond(new Date(), -1)
    }
    return false
  } else {
    if (ipList[ipAddress].firstAttempt == null) {
      ipList[ipAddress].firstAttempt = new Date()
    }
    ipList[ipAddress].attemptCount++
    let diffSeconds = ((new Date()).getTime() - ipList[ipAddress].firstAttempt.getTime()) / 1000

    if (ipList[ipAddress].attemptCount > 100 && diffSeconds < 60) {
      ipList[ipAddress].suspended = dateAddSecond(new Date(), options.suspendInterval)
      ipList[ipAddress].attemptCount = 0
      ipList[ipAddress].firstAttempt = null
      return options.suspendInterval
    } else if (ipList[ipAddress].attemptCount > 100 && diffSeconds > 60 && diffSeconds < options.suspendInterval) {
      ipList[ipAddress].suspended = dateAddSecond(new Date(), options.suspendInterval)
      ipList[ipAddress].attemptCount = 0
      ipList[ipAddress].firstAttempt = null

      return options.suspendInterval
    } else if (ipList[ipAddress].attemptCount > 100 && diffSeconds > 60) {
      ipList[ipAddress].attemptCount = 0
      ipList[ipAddress].firstAttempt = null
      return false
    } else {
      return false
    }

  }
}

function dateAddSecond(date, sec) {
  let d = new Date(date)
  return new Date(d.setTime(d.getTime() + sec * 1000))
}