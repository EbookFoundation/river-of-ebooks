'use strict';

import Actions from '../actions/login';

const reducer = (state = {}, action) => {
  const {type, data} = action;
  switch (type) {
    case Actions.set_user:
      return {
        user: {
          ...state.user,
          email: data
        }
      };
    case Actions.set_password:
      return {
        user: {
          ...state.user,
          password: data
        }
      };
    case Actions.set_carousel:
      return {
        carouselPosition: data
      };
    case Actions.set_working:
      return {
        working: data
      };
    case Actions.set_error:
      switch (data.type) {
        case 'email':
          return {
            emailError: data.error
          };
        case 'password':
          return {
            passwordError: data.error
          };
        default: return {};
      }
    case Actions.clear_error:
      return {
        emailError: '',
        passwordError: ''
      };
  }
};

export default reducer;
