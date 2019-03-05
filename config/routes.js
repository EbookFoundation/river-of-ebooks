/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': {
    view: 'pages/index'
  },
  'GET /login': {
    view: 'pages/login'
  },
  'GET /register': {
    view: 'pages/login'
  },
  // figure out why proper clientside routing breaks the backend session
  'GET /account': 'TargetController.show',
  'GET /targets': 'TargetController.show',
  'GET /keys': 'TargetController.show',
  'GET /admin': 'AdminController.show',
  'GET /admin/*': {
    action: 'admin/show',
    skipAssets: true
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  'POST /register': 'UserController.create',
  'GET /logout': 'AuthController.logout',

  'POST /auth/email_exists': 'AuthController.emailExists',
  'POST /auth/email_available': 'AuthController.emailAvailable',

  'GET /api/me': 'UserController.me',
  'PATCH /api/me': 'UserController.edit',

  'POST /auth/:provider': 'AuthController.callback',
  'POST /auth/:provider/:action': 'AuthController.callback',

  'GET /auth/:provider': 'AuthController.provider',
  'GET /auth/:provider/callback': 'AuthController.callback',
  'GET /auth/:provider/:action': 'AuthController.callback',

  'POST /api/publish': 'BooksController.publish',
  'GET /api/books': 'BooksController.list',

  'GET /api/catalog': 'CatalogController.navigation',
  'GET /api/catalog/new': 'CatalogController.listNew',
  'GET /api/catalog/all': 'CatalogController.listAll',

  'POST /api/targets': 'TargetController.create',
  'GET /api/targets': 'TargetController.list',
  'PATCH /api/targets/:id': 'TargetController.edit',
  'DELETE /api/targets/:id': 'TargetController.delete',

  'POST /api/keys': 'PublishKeyController.create',
  'GET /api/keys': 'PublishKeyController.list',
  'PATCH /api/keys/:id': 'PublishKeyController.refresh',
  'DELETE /api/keys/:id': 'PublishKeyController.delete',
  'POST /api/keys/:id/verify': 'PublishKeyController.verify',

  'GET /admin/api/users': 'AdminController.listUsers',
  'GET /admin/api/publishers': 'AdminController.listPublishers',
  'PATCH /admin/api/users/:id': 'AdminController.editUser',
  'PATCH /admin/api/publishers/:id': 'AdminController.editPublisher',
  'DELETE /admin/api/users/:id': 'AdminController.deleteUser',
  'DELETE /admin/api/publishers/:id': 'AdminController.deletePublisher'

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝

}
