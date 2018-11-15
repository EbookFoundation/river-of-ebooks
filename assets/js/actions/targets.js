'use strict'

import Ajax from '../lib/Ajax'

const ACTIONS = {
  set_working: 'set_working',
  add_url: 'add_url',
  edit_url: 'edit_url',
  delete_url: 'delete_url',
  list_url: 'list_url',
  error: 'error'
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

export const addUrl = url => ({
  type: ACTIONS.add_url,
  data: url
})

export const changeUrlField = (id, value) => ({
  type: ACTIONS.edit_url,
  data: {
    id,
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

export const fetchUrls = () => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    const { data } = await Ajax.get({
      url: '/api/targets'
    })
    dispatch(setUrls(data))
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

export const setUrl = (id, value) => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    await Ajax.patch({
      url: '/api/targets/' + id,
      data: {
        url: value
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
