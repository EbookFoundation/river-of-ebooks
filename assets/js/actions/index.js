'use strict'

import Ajax from '../lib/Ajax'
const FileSaver = require('file-saver')

const getPath = str => window.location.hostname === 'localhost' ? `http://localhost:3000${str}` : str

const ACTIONS = {
  set_working: 'set_working',
  add_url: 'add_url',
  edit_url: 'edit_url',
  delete_url: 'delete_url',
  list_url: 'list_url',
  set_editing_uri: 'set_editing_uri',
  set_editing_publisher: 'set_editing_publisher',
  error: 'error',
  set_user: 'set_user',
  add_publisher: 'add_publisher',
  delete_publisher: 'delete_publisher',
  set_publishers: 'set_publishers',
  update_publisher: 'update_publisher'
}

export default ACTIONS

export const setWorking = working => ({
  type: ACTIONS.set_working,
  data: working
})

export const setUrls = (urls) => ({
  type: ACTIONS.list_url,
  data: urls
})

export const setUser = user => ({
  type: ACTIONS.set_user,
  data: user
})

export const setPublishers = user => ({
  type: ACTIONS.set_publishers,
  data: user
})

export const addUrl = url => ({
  type: ACTIONS.add_url,
  data: url
})

export const addPublisher = url => ({
  type: ACTIONS.add_publisher,
  data: url
})

export const updatePublisher = data => ({
  type: ACTIONS.update_publisher,
  data: data
})

export const setEditing = () => (dispatch) => {
  dispatch(setEditingUri(null))
  dispatch(setEditingPublisher(null))
}

export const setEditingUri = id => ({
  type: ACTIONS.set_editing_uri,
  data: id
})

export const setEditingPublisher = id => ({
  type: ACTIONS.set_editing_publisher,
  data: id
})

export const changeUrlField = (id, what, value) => ({
  type: ACTIONS.edit_url,
  data: {
    id,
    what,
    value
  }
})

export const removeUrl = id => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    await Ajax.delete({
      url: getPath('/api/targets/' + id)
    })
    dispatch({
      type: ACTIONS.delete_url,
      data: id
    })
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const fetchData = () => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    const { data: user } = await Ajax.get({
      url: getPath('/api/me')
    })
    dispatch(setUser(user))
    const { data: urls } = await Ajax.get({
      url: getPath('/api/targets')
    })
    dispatch(setUrls(urls))

    const { data: publishers } = await Ajax.get({
      url: getPath('/api/keys')
    })
    dispatch(setPublishers(publishers))
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const createNewUrl = () => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    const { data } = await Ajax.post({
      url: getPath('/api/targets')
    })
    dispatch(addUrl(data))
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const setUrl = (value) => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    await Ajax.patch({
      url: getPath('/api/targets/' + value.id),
      data: {
        ...value,
        id: undefined
      }
    })
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const editUser = (user) => async (dispatch, getState) => {
  dispatch(setWorking(true))

  try {
    // if (!user.currentPassword) throw new Error('Please enter your current password.')
    await Ajax.patch({
      url: getPath('/api/me'),
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        currentPassword: user.currentPassword
      }
    })
    dispatch({
      type: ACTIONS.error,
      data: null
    })
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const createNewPublisher = ({ name, url }) => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    const { data } = await Ajax.post({
      url: getPath('/api/keys'),
      data: {
        name,
        url
      }
    })
    dispatch(addPublisher(data))
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const removePublisher = id => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    await Ajax.delete({
      url: getPath('/api/keys/' + id)
    })
    dispatch({
      type: ACTIONS.delete_publisher,
      data: id
    })
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const verifyDomain = id => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    const { data } = await Ajax.post({
      url: getPath(`/api/keys/${id}/verify`)
    })
    dispatch(updatePublisher(data))
    dispatch(setEditingPublisher(null))
  } catch (e) {
    dispatch({
      type: ACTIONS.error,
      data: e
    })
  } finally {
    dispatch(setWorking(false))
  }
}

export const saveFile = data => (dispatch) => {
  var blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, data)
}
