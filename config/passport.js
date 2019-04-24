/**
* Passport configuration
*/

module.exports.passport = {
  local: {
    strategy: require('passport-local').Strategy
  },
  google: {
    strategy: require('passport-google-oauth20').Strategy,
    protocol: 'oauth2',
    callback: '/auth/google/callback',
    options: {
      clientID: process.env.PASSPORT_GOOGLE_ID,
      clientSecret: process.env.PASSPORT_GOOGLE_SECRET
    }
  },
  github: {
    strategy: require('passport-github2').Strategy,
    protocol: 'oauth2',
    callback: '/auth/github/callback',
    options: {
      clientID: process.env.PASSPORT_GITHUB_ID,
      clientSecret: process.env.PASSPORT_GITHUB_SECRET
    }
  }
}
