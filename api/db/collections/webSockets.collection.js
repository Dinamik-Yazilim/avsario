// const { permissionSchemaType } = require('../../helpers/db-types')
const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      socketId: { type: String, unique: true },  // socket.id: UUID string
      session: { type: ObjectId, ref: 'sessions', index: true },
      member: { type: ObjectId, ref: 'members', index: true },
      role: { type: String },
      connected: { type: Boolean, default: false, index: true },
      lastPong: { type: Date, default: Date.now, index: true },
      lastIP: { type: String, default: '' },
      logs: [],
    },
    { versionKey: false, timestamps: true }
  )

  schema.pre('save', (next) => next())
  schema.pre('remove', (next) => next())
  schema.pre('remove', true, (next, done) => next())
  schema.on('init', (model) => { })
  schema.plugin(mongoosePaginate)

  let model = dbModel.conn.model(collectionName, schema, collectionName)

  model.removeOne = (session, filter) =>
    sendToTrash(dbModel, collectionName, session, filter)
  return model
}
