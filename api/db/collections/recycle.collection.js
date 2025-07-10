const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      collectionName: { type: String, default: '', index: true },
      documentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        index: true,
      },
      document: { type: Object, default: null },
      // deletedBy: { type: String, required: true, default: '', index: true },
      deletedBy: { type: String, default: '', index: true },
      deletedById: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        index: true,
      },
      deletedDate: { type: Date, default: Date.now, index: true },
    },
    {
      versionKey: false,
      capped: { size: 200 * 1024 * 1024, max: 500, autoIndexId: true },
    }
  )

  schema.pre('save', (next) => next())
  schema.pre('remove', (next) => next())
  schema.pre('remove', true, (next, done) => next())
  schema.on('init', (model) => { })
  schema.plugin(mongoosePaginate)

  let model = dbModel.conn.model(collectionName, schema, collectionName)

  return model
}
