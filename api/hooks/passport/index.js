let passportHook = sails.hooks.passport

if (!passportHook) {
  passportHook = function (sails) {
    return {
      initialize: async function (cb) {
        const helper = await sails.helpers.passport()
        helper.loadStrategies()
        /*sails.after('hook:helpers:loaded', function () {
        })*/
        return cb()
      }
    }
  }
}

module.exports = passportHook
