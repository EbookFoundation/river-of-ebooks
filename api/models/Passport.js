const bcrypt = require('bcrypt');

async function hashPassword (passport) {
  try {
    var config = sails.config.auth.bcrypt;
    var salt = config.rounds;
    if (passport.password) {
      const hash = await bcrypt.hash(passport.password, salt);
      passport.password = hash;
    }
    return passport;
  } catch (e) {
    delete passport.password;
    sails.log.error(e);
    throw e;
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
    id: {
      type: 'number',
      unique: true,
      autoIncrement: true,
      columnName: '_id'
    },
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
    }
  },

  /**
  * callback run before creating a Passport
  */
  beforeCreate: async function (passport, next) {
    await hashPassword(passport);
    return next();
  },

  /**
  * callback run before updating
  */
  beforeUpdate: async function (passport, next) {
    await hashPassword(passport);
    return next();
  },

  // methods
  validatePassword: async function (password, passport) {
    return bcrypt.compare(password, passport.password);
  }
};
