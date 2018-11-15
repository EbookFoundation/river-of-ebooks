'use strict'

import Actions from '../actions/targets'

const reducer = (state = {}, action) => {
  const { type, data } = action
  switch (type) {
    case Actions.set_working:
      return {
        working: data
      }
    case Actions.list_url:
      return {
        urls: data || []
      }
    case Actions.add_url:
      return {
        urls: state.urls.concat(data)
      }
    default: return {}
  }
}

export default reducer
