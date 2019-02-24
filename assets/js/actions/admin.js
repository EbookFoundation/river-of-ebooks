'use strict'

import Ajax from '../lib/Ajax'

const getPath = str => window.location.hostname === 'localhost' ? `http://localhost:3000${str}` : str

const ACTIONS = {
  set_working: 'set_working',
  error: 'error',
  set_admin_data: 'set_admin_data'
}

export default ACTIONS

export const setWorking = working => ({
  type: ACTIONS.set_working,
  data: working
})

export const fetchAdminData = () => async (dispatch, getState) => {
  dispatch(setWorking(true))
  try {
    const { data: user } = await Ajax.get({
      url: getPath('/api/me')
    })

    const { data: users } = await Ajax.get({
      url: getPath('/admin/api/users')
    })

    const { data: publishers } = await Ajax.get({
      url: getPath('/admin/api/publishers')
    })

    dispatch({
      type: ACTIONS.set_admin_data,
      data: {
        user,
        users,
        publishers
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
