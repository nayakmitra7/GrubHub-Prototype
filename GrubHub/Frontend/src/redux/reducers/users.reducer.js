import { userConstants } from '../constants/user.constants';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.user
      };
    case userConstants.UPDATE_SUCCESS:
      return {
        ...state,
        user: action.user
      };
    case userConstants.UPDATE_FAILURE:
      return {
        user: action.user
      };
    case userConstants.FETCH_PAST_ORDER_SUCCESS:
      return {
        ...state,
        order: action.order
      };
    case userConstants.FETCH_UPCOMING_ORDER_SUCCESS:
      return {
        ...state,
        order: action.order
      };
    case userConstants.FETCH_SENT_MESSAGE_SUCCESS:
      return {
        ...state,
        message:action.message
      };
      case userConstants.FETCH_RECEIVED_MESSAGE_SUCCESS:
      return {
        ...state,
        message:action.message
      };
    default:
      return state
  }
}