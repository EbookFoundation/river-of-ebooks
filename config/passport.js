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
    options: {}
  },
  github: {
    strategy: require('passport-github2').Strategy,
    protocol: 'oauth2',
    callback: '/auth/github/callback',
    options: {}
  }
}
