module.exports = (dbModel, sessionDoc, req) =>
  new Promise((resolve, reject) => {
    if (req.method === 'POST') {
      if (req.params.param1) {
        let filter = { member: sessionDoc.member, closed: false }
        if (req.params.param1 == 'others') filter._id = { $ne: sessionDoc._id }
        else if (req.params.param1 != 'all') filter._id = req.params.param1

        dbModel.sessions
          .updateMany(filter, { $set: { closed: true } }, { multi: true })
          .then((c) => resolve(`${c.modifiedCount} session(s) closed`)) //qwerty  %s gibi printf tarzinda bir model olusturalim
          .catch(reject)
      } else {
        sessionDoc.closed = true
        sessionDoc.lastOnline = new Date()
        sessionDoc.save().then(resolve('session closed successfully'))
      }
    } else {
      restError.method(req, reject)
    }
  })
