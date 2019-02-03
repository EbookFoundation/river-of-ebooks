'use strict'

import Ajax from '../lib/Ajax'

const ACTIONS = {
  set_working: 'set_working',
  set_user: 'set_user',
  set_password: 'set_password',
  set_carousel: 'set_carousel',
  set_error: 'set_error',
  clear_error: 'clear_error'
}

export default ACTIONS

export const setWorking = working => ({
  type: ACTIONS.set_working,
  data: working
})

export const setEmail = email => ({
  type: ACTIONS.set_user,
  data: email
})

export const setPassword = pass => ({
  type: ACTIONS.set_password,
  data: pass
})

export const setCarousel = pos => (dispatch, getState) => {
  dispatch(clearError())
  dispatch({
    type: ACTIONS.set_carousel,
    data: pos
  })
}

export const setError = data => ({
  type: ACTIONS.set_error,
  data: data
})

export const clearError = () => ({
  type: ACTIONS.clear_error
})

export const setLoggedIn = (data) => (dispatch, getState) => {
  window.localStorage.setItem('roe-token', JSON.stringify(data))
  window.location.href = '/app'
}

export const checkEmail = email => async (dispatch, getState) => {
  dispatch(setWorking(true))
  dispatch(clearError())
  if (/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(email)) {
    try {
      await Ajax.post({
        url: '/auth/email_exists',
        data: {
          email
        }
      })
      dispatch(setCarousel(2))
    } catch (e) {
      dispatch(setError({
        type: 'email',
        error: 'An account with that email does not exist.'
      }))
    }
  } else {
    dispatch(setError({
      type: 'email',
      error: 'Please enter a valid email address.'
    }))
  }
  dispatch(setWorking(false))
}

export const checkPassword = (email, password) => async (dispatch, getState) => {
  dispatch(setWorking(true))

  // do email + password check
  try {
    const res = await Ajax.post({
      url: '/auth/local',
      data: {
        identifier: email,
        password
      }
    })
    dispatch(setLoggedIn(res))
    //  dispatch(setWorking(false))
  } catch (e) {
    dispatch(setError({
      type: 'password',
      error: e.message
    }))
    dispatch(setWorking(false))
  }
}

export const signup = (email, password) => async (dispatch, getState) => {
  dispatch(setWorking(true))
  dispatch(clearError())
  if (/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(email)) {
    try {
      await Ajax.post({
        url: '/auth/email_available',
        data: {
          email
        }
      })
      await Ajax.post({
        url: '/register',
        data: {
          email,
          password
        }
      })
      dispatch(setCarousel(2))
    } catch (e) {
      dispatch(setError({
        type: 'email',
        error: e.message
      }))
    }
  } else {
    dispatch(setError({
      type: 'email',
      error: 'Please enter a valid email address.'
    }))
  }
  dispatch(setWorking(false))
}
