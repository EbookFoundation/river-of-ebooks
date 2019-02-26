/* global XMLHttpRequest FormData */
'use strict'

let ajaxcfg = {}

class AjaxError extends Error {
  constructor (reason, data, xhr) {
    super(reason)
    this.data = data
    this.xhr = xhr
  }
}

export default class Ajax {
  static async get (opts) {
    if (!opts) opts = {}
    opts.method = 'get'
    return Ajax.ajax(opts)
  }
  static async post (opts) {
    if (!opts) opts = {}
    opts.method = 'post'
    return Ajax.ajax(opts)
  }
  static async put (opts) {
    if (!opts) opts = {}
    opts.method = 'put'
    return Ajax.ajax(opts)
  }
  static async patch (opts) {
    if (!opts) opts = {}
    opts.method = 'patch'
    return Ajax.ajax(opts)
  }
  static async delete (opts) {
    if (!opts) opts = {}
    opts.method = 'delete'
    return Ajax.ajax(opts)
  }
  static async head (opts) {
    if (!opts) opts = {}
    opts.method = 'head'
    return Ajax.ajax(opts)
  }
  static async options (opts) {
    if (!opts) opts = {}
    opts.method = 'options'
    return Ajax.ajax(opts)
  }
  static ajax (opts) {
    return new Promise((resolve, reject) => {
      if (!opts) reject(new Error('Missing required options parameter.'))
      if (opts.method) {
        if (!['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(opts.method.toLowerCase())) reject(new Error('opts.method must be one of: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.'))
        opts.method = opts.method.toUpperCase()
      }

      var xhr = opts.xhr || new XMLHttpRequest()

      var fd = null
      var qs = ''
      if (!opts.noProcess && opts.data && opts.method.toLowerCase() !== 'get') {
        fd = new FormData()
        for (let key in opts.data) {
          fd.append(key, opts.data[key])
        }
      } else if (!opts.noProcess && opts.data) {
        qs += '?'
        let params = []
        for (let key in opts.data) {
          params.push([key, opts.data[key]].join('='))
        }
        qs += params.join('&')
      }

      if (opts.noProcess) {
        opts.headers = {
          'Content-Type': 'application/json',
          ...opts.headers
        }
        try { fd = JSON.stringify(opts.data) } catch (e) { console.warn(e) }
      }

      xhr.onload = () => {
        if (!('' + xhr.status).startsWith('2')) { return xhr.onerror() }
        var data = xhr.response
        try {
          data = JSON.parse(data)
        } catch (e) {}
        resolve({
          data,
          xhr
        })
      }
      xhr.onerror = () => {
        var data = xhr.response
        try { data = JSON.parse(data) } catch (e) {}

        // method not allowed
        if (xhr.status === 405) {
          reject(new AjaxError('405 Method Not Allowed', data.error || data, xhr))
          return
        } else if (xhr.status === 404) {
          reject(new AjaxError('404 Not Found', data.error || data, xhr))
          return
        }

        try {
          // if the access token is invalid, try to use the refresh token
          var json = data
          if (json.error === 'access_denied' && json.hint.includes('token') && json.hint.includes('invalid') && ajaxcfg.refresh_token) {
            return Ajax.refresh(opts)
          } else if (json.error === 'access_denied' && json.hint.includes('token') && json.hint.includes('revoked')) {
            reject(new AjaxError('token revoked', data, xhr))
          }
        } catch (e) {
          reject(new AjaxError(e.toString(), data.error || data, xhr))
        } finally {
          reject(new AjaxError(data.error || data, xhr.status, xhr))
        }
      }

      xhr.open(opts.method || 'GET', opts.url + qs || window.location.href)
      if (opts.headers) {
        for (let key in opts.headers) xhr.setRequestHeader(key, opts.headers[key])
      }
      if (ajaxcfg.access_token && !(opts.headers || {}).Authorization) xhr.setRequestHeader('Authorization', 'Bearer ' + ajaxcfg.access_token)
      xhr.send(fd)
    })
  }
  static refresh (opts) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()

      var fd = new FormData()
      const OAUTH_TOKEN_REQUEST = {
        grant_type: 'refresh_token',
        refresh_token: ajaxcfg.refresh_token,
        client_id: 'foxfile',
        client_secret: 1
      }
      for (var key in OAUTH_TOKEN_REQUEST) {
        fd.append(key, OAUTH_TOKEN_REQUEST[key])
      }
      // try original request
      xhr.onload = () => {
        if (xhr.status !== 200) return xhr.onerror()
        if (ajaxcfg.refresh) ajaxcfg.refresh(xhr.response)
        var json = JSON.parse(xhr.response)
        ajaxcfg.access_token = json.access_token
        ajaxcfg.refresh_token = json.refresh_token
        return Ajax.ajax(opts)
      }
      // if this fails, dont try again
      xhr.onerror = () => {
        var data = xhr.response
        reject(new AjaxError(xhr.status, data, xhr))
      }
      xhr.open('POST', ajaxcfg.refresh_url)
      xhr.send(fd)
    })
  }
  static setTokenData (tokens) {
    if (!tokens) throw new Error('Missing tokens.')
    if (!tokens.access_token && !tokens.refresh_token && !tokens.refresh_url) throw new Error('Missing at least one of: access_token, refresh_token, refresh_url.')
    if (tokens.access_token) ajaxcfg.access_token = tokens.access_token
    if (tokens.refresh_token) ajaxcfg.refresh_token = tokens.refresh_token
    if (tokens.refresh_url) ajaxcfg.refresh_url = tokens.refresh_url
    return true
  }
  static onRefresh (func) {
    ajaxcfg.refresh = func
  }
}
