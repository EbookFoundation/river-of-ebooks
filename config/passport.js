/**
* Passport configuration
*/

module.exports.passport = {
  local: {
    strategy: require('passport-local').Strategy
  }
};
