'use strict'

import Ajax from '../lib/Ajax'

const ACTIONS = {
  set_working: 'set_working',
  add_url: 'add_url',
  edit_url: 'edit_url',
  delete_url: 'delete_url',
  list_url: 'list_url',
  set_editing: 'set_editing',
  error: 'error',
  set_user: 'set_user'
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

export const addUrl = url => ({
  type: ACTIONS.add_url,
  data: url
})

export const setEditing = id => ({
  type: ACTIONS.set_editing,
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
      url: '/api/targets/' + id
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
      url: '/api/me'
    })
    dispatch(setUser(user))
    const { data: urls } = await Ajax.get({
      url: '/api/targets'
    })
    dispatch(setUrls(urls))
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
      url: '/api/targets'
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
      url: '/api/targets/' + value.id,
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
