import { userConstants } from '../constants/user.constants';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.user
      };
    case userConstants.UPDATE_FAILURE:
      return {
        ...state,
        details: action.details
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
        messageSent: action.message,
        messageReceived:""
      };
    case userConstants.FETCH_RECEIVED_MESSAGE_SUCCESS:
      return {
        ...state,
        messageSent:"",
        messageReceived: action.message
      };
    case userConstants.FETCH_DETAILS_SUCCESS:
      return {
        ...state,
        details: action.details
      };
    case userConstants.UPDATE_SUCCESS:
      return {
        ...state,
        details: action.details
      };
    case userConstants.SIGNUP_SUCCESS:
      return {
        ...state,
        buyer: action.buyer
      };
    case userConstants.FETCH_RESTAURANT_SUCCESS:
      return {
        ...state,
        restaurants: action.restaurants
      };
    case userConstants.FETCH_SECTION_SUCCESS:
      return {
        ...state,
        sections: action.sections
      };
    case userConstants.FETCH_ITEMS_SUCCESS:
      return {
        ...state,
        items: action.items
      };
    default:
      return state
  }
}