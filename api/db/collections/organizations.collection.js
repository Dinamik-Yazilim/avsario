const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      name: { type: String, unique: true },
      billingInfo: {
        individual: { type: Boolean, default: false, index: true },
        companyName: { type: String, default: '', index: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        taxOffice: { type: String, default: '', index: true },
        taxNumber: { type: String, default: '', index: true },
        idCardNo: { type: String, default: '', index: true },
        eInvoiceMember: { type: Boolean, default: false, index: true },
        eDespatchMember: { type: Boolean, default: false, index: true },
        postboxAlias: { type: String, default: '', index: true },
      },
      address: {
        room: { type: String, default: '' },
        streetName: { type: String, default: '', index: true },
        blockName: { type: String, default: '' },
        buildingName: { type: String, default: '' },
        buildingNumber: { type: String, default: '' },
        citySubdivisionName: { type: String, default: '' },
        cityName: { type: String, default: '', index: true },
        postalZone: { type: String, default: '' },
        postbox: { type: String, default: '' },
        region: { type: String, default: '' },
        district: { type: String, default: '', index: true },
        country: {
          identificationCode: { type: String, default: '' },
          name: { type: String, default: '' }
        },
      },
      passive: { type: Boolean, default: false, index: true }
    },
    { versionKey: false, timestamps: true }
  )

  schema.pre('save', async function (next) {
    const doc = this
    doc.fullName = (doc.firstName || '') + ' ' + (doc.lastName || '')
    next()
  })
  schema.pre('remove', (next) => next())
  schema.pre('remove', true, (next, done) => next())
  schema.on('init', (model) => { })
  schema.plugin(mongoosePaginate)

  let model = dbModel.conn.model(collectionName, schema, collectionName)

  model.removeOne = (member, filter) => sendToTrash(dbModel, collectionName, member, filter)
  return model
}
