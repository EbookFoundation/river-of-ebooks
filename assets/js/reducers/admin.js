'use strict'

import Actions from '../actions/admin'

const reducer = (state = {}, action) => {
  const { type, data } = action
  let ind
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
    case Actions.a_update_user:
      const modifiedUsers = [ ...state.users ]
      ind = modifiedUsers.findIndex(x => x.id === data.id)
      modifiedUsers[ind] = { ...modifiedUsers[ind], ...data }
      return {
        users: modifiedUsers
      }
    case Actions.a_update_publisher:
      const modifiedPublishers = [ ...state.publishers ]
      ind = modifiedPublishers.findIndex(x => x.id === data.id)
      modifiedPublishers[ind] = { ...modifiedPublishers[ind], ...data }
      return {
        publishers: modifiedPublishers
      }
    default: return {}
  }
}

export default reducer
