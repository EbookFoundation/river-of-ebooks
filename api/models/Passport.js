const bcrypt = require('bcrypt')

async function hashPassword (passport) {
  try {
    var config = sails.config.auth.bcrypt
    var salt = config.rounds
    if (passport.password) {
      const hash = await bcrypt.hash(passport.password, salt)
      passport.password = hash
    }
    return passport
  } catch (e) {
    delete passport.password
    sails.log.error(e)
    throw e
  }
}

/**
 * Passport.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    // local, oauth2, etc
    protocol: {
      type: 'string',
      required: true
    },
    password: 'string',
    accessToken: 'string',
    provider: 'string',
    identifier: 'string',
    tokens: 'json',

    // User association
    user: {
      model: 'User',
      required: true
    },

    // methods
    validatePassword: async function (password) {
      return bcrypt.compare(password, this.password)
    }
  },

  /**
  * callback run before creating a Passport
  */
  beforeCreate: async function (passport) {
    return hashPassword(passport)
  },

  /**
  * callback run before updating
  */
  beforeUpdate: async function (passport) {
    return hashPassword(passport)
  }
}
