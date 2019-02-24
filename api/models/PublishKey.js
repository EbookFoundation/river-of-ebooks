const crypto = require('crypto')

function generateToken({ bytes, base }) {
  return new Promise((res, rej) => {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) rej(err)
      else res(buf.toString(base || 'base64'))
    })
  })
}

module.exports = {
  attributes: {
    id: {
      type: 'number',
      unique: true,
      autoIncrement: true
    },
    user: {
      model: 'User',
      required: true
    },
    url: {
      type: 'string',
      required: true
    },
    key: {
      type: 'string',
      required: true
    },
    secret: {
      type: 'string',
      required: true
    }
  },
  beforeCreate: async function (key, next) {
    key.key = await generateToken({ bytes: 12 })
    key.secret = await generateToken({ bytes: 48 })
    next()
  },
  beforeUpdate: async function (key, next) {
    key.secret = await generateToken({ bytes: 48 })
    next()
  }
}
