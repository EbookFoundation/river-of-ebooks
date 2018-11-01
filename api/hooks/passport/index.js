let passportHook = sails.hooks.passport

if (!passportHook) {
  passportHook = function (sails) {
    return {
      initialize: async function (cb) {
        const helper = await sails.helpers.passport()
        helper.loadStrategies()
        return cb()
      }
    }
  }
}

module.exports = passportHook
