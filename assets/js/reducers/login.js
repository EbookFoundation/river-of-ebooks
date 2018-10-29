import Actions from '../actions/login'

const reducer = (state = {}, action) => {
  const {type, data} = action
  switch (type) {
    case Actions.set_user:
      return {
        user: {
          ...state.user,
          email: data
        }
      }
    case Actions.set_password:
      return {
        user: {
          ...state.user,
          password: data
        }
      }
    case Actions.set_carousel:
      return {
        carouselPosition: data
      }
  }
}

export default reducer
