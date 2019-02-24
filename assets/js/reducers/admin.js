'use strict'

import Actions from '../actions/admin'

const reducer = (state = {}, action) => {
  const { type, data } = action
  switch (type) {
    case Actions.set_working:
      return {
        working: data
      }
    case Actions.set_admin_data:
      return {
        user: data.user,
        users: data.users,
        publishers: data.publishers
      }
    default: return {}
  }
}

export default reducer
