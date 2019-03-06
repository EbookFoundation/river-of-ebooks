const crypto = require('crypto')
const APP_VERSION = 'v0'

function asyncRead (adapter, helper, storage) {
  return new Promise((resolve, reject) => {
    adapter.read(storage, (err, data) => {
      if (err) return reject(err)
      try {
        data = data.toString('utf-8')
        let result
        if ((result = helper.deserializeOpds1(data)) !== false) {
          resolve(result)
        } else {
          resolve(JSON.parse(data))
        }
      } catch (e) {
        reject(e)
      }
    })
  })
}

function generateToken ({ bytes, base }) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) reject(err)
      else resolve(buf.toString(base || 'base64'))
    })
  })
}

function hmacSign (secret, timestamp, body) {
  const value = `${APP_VERSION}:${timestamp}:${body}`
  const hmac = crypto.createHmac('sha256', secret.toString()).update(value, 'utf-8').digest('hex')
  return `${APP_VERSION}=${hmac}`
}

module.exports = {
  asyncRead,
  generateToken,
  hmacSign
}
