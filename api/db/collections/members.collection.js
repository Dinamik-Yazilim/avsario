const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      organization: { type: ObjectId, ref: 'organizations', default: null, index: true },
      username: { type: String, required: true, index: true },
      password: { type: String, default: null, index: true, select: false },
      role: { type: String, default: 'user', enum: ['user', 'owner', 'admin'] },
      name: { type: String, default: '', index: true },
      passive: { type: Boolean, default: false, index: true },
    },
    { versionKey: false, timestamps: true }
  )

  schema.pre('save', (next) => next())
  schema.pre('remove', (next) => next())
  schema.pre('remove', true, (next, done) => next())
  schema.on('init', (model) => { })
  schema.plugin(mongoosePaginate)

  let model = dbModel.conn.model(collectionName, schema, collectionName)

  model.removeOne = (member, filter) => sendToTrash(dbModel, collectionName, member, filter)
  return model
}
