'use strict'

import Actions from '../actions'

const reducer = (state = {}, action) => {
  const { type, data } = action
  let urls
  switch (type) {
    case Actions.set_working:
      return {
        working: data
      }
    case Actions.set_user:
      return {
        user: {
          ...state.user,
          ...data
        }
      }
    case Actions.set_publishers:
      return {
        publishers: data
      }
    case Actions.list_url:
      return {
        urls: data || []
      }
    case Actions.add_url:
      return {
        urls: state.urls.concat(data),
        error: ''
      }
    case Actions.delete_url:
      return {
        urls: state.urls.filter(x => x.id !== data),
        error: ''
      }
    case Actions.edit_url:
      urls = state.urls
      urls.find(x => x.id === data.id)[data.what] = data.value
      return {
        urls: urls
      }
    case Actions.set_editing:
      return {
        editingUrl: data
      }
    case Actions.error:
      return {
        error: (data || {}).message || ''
      }
    case Actions.add_publisher:
      return {
        publishers: state.publishers.concat(data),
        error: ''
      }
    case Actions.delete_publisher:
      return {
        publishers: state.publishers.filter(x => x.id !== data),
        error: ''
      }
    default: return {}
  }
}

export default reducer
