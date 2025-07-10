exports.updateBalances = function (dbModel, sessionDoc, dairyPageDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      // const dairyPageDoc = await dbModel.dairyPages.findOne({ _id: dairyPageId })
      let list = await dbModel.dairyPages.find({ issueDate: { $gte: dairyPageDoc.issueDate } }).sort({ issueDate: 1 })
      let i = 0
      let balance = dairyPageDoc.transferBalance
      while (i < list.length) {

        list[i].transferBalance = balance
        list[i].debit = 0
        list[i].credit = 0
        const finDocs = await dbModel.mentalWorks.aggregate([
          { $match: { member: sessionDoc.member, dairyPage: list[i]._id } },
          { $group: { _id: "$dairyPage", total: { $sum: "$total" }, } }
        ])
        if (finDocs.length > 0) {
          list[i].debit = finDocs[0].total
        }
        const paymentDocs = await dbModel.realPayments.aggregate([
          { $match: { member: sessionDoc.member, dairyPage: list[i]._id } },
          { $group: { _id: "$dairyPage", total: { $sum: "$total" }, } }
        ])
        if (paymentDocs.length > 0) {
          list[i].credit = paymentDocs[0].total
        }

        list[i].balance = list[i].transferBalance + list[i].debit - list[i].credit
        balance = list[i].balance
        await list[i].save()
        i++
      }
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
