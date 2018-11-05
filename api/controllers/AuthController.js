/**
 * Authentication Controller
 */
// some also from https://github.com/trailsjs/sails-auth

module.exports = {

  /**
  * check if the given email has a corresponding user
  */
  emailExists: async function (req, res) {
    const user = await User.findOne({
      email: req.param('email')
    });
    if (!user) {
      return res.status(404).json({
        error: 'user does not exist'
      });
    } else {
      return res.json({
        status: 'ok'
      });
    }
  },
  /**
  * opposite of emailExists
  */
  emailAvailable: async function (req, res) {
    const user = await User.findOne({
      email: req.param('email')
    });
    if (user) {
      return res.status(401).json({
        error: 'that email address is not available'
      });
    } else {
      return res.json({
        status: 'ok'
      });
    }
  },

  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: function (req, res) {
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    if (!req.isSocket) {
      res.redirect(req.query.next || '/');
    } else {
      res.ok();
    }
  },

  /**
   * Create a third-party authentication endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  provider: async function (req, res) {
    const passportHelper = await sails.helpers.passport();
    passportHelper.endpoint(req, res);
  },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: async function (req, res) {
    const action = req.param('action');
    const passportHelper = await sails.helpers.passport();

    function negotiateError (err) {
      if (action === 'register') {
        res.redirect('/register');
      } else if (action === 'login') {
        res.redirect('/login');
      } else if (action === 'disconnect') {
        res.redirect('back');
      } else {
        // make sure the server always returns a response to the client
        // i.e passport-local bad username/email or password
        res.status(401).json({
          'error': err.toString()
        });
      }
    }

    passportHelper.callback(req, res, (err, user, info, status) => {
      if (err || !user) {
        sails.log.warn(user, err, info, status);
        if (!err && info) {
          return negotiateError(info);
        }
        return negotiateError(err);
      }

      req.login(user, (err) => {
        if (err) {
          sails.log.warn(err);
          return negotiateError(err);
        }

        req.session.authenticated = true;

        // redirect if there is a 'next' param
        if (req.query.next) {
          res.status(302).set('Location', req.query.next);
        }

        sails.log.info('user', user, 'authenticated successfully');
        return res.json(user);
      });
    });
  },

  /**
   * Disconnect a passport from a user
   *
   * @param {Object} req
   * @param {Object} res
   */
  disconnect: async function (req, res) {
    const passportHelper = await sails.helpers.passport();
    passportHelper.disconnect(req, res);
  }
};
