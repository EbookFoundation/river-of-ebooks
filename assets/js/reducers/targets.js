'use strict'

import Actions from '../actions/targets'

const reducer = (state = {}, action) => {
  const { type, data } = action
  let urls
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
      urls.find(x => x.id === data.id).url = data.value
      return {
        urls: urls
      }
    case Actions.error:
      return {
        error: data.message
      }
    default: return {}
  }
}

export default reducer
