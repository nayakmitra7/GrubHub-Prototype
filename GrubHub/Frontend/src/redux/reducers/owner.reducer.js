import { ownerConstants } from '../constants/owner.constants';

export function owner(state = {}, action) {
  switch (action.type) {
    case ownerConstants.UPDATE_SUCCESS:
      return {
        owner: action.user
      };
    case ownerConstants.UPDATE_FAILURE:
      return {
        owner: action.user
      };
    case ownerConstants.FETCH_SUCCESS:

      return {
        owner: action.user
      };
    case ownerConstants.OWNER_LOGIN_SUCCESS:
      return {
        ...state,
        owner: action.owner
      };
    case ownerConstants.OWNER_FETCH_RECEIVED_MESSAGE_SUCCESS:
      return {
        ...state,
        messageSent: "",
        messageReceived: action.message
      };
    case ownerConstants.OWNER_FETCH_SENT_MESSAGE_SUCCESS:
      return {
        ...state,
        messageSent: action.message,
        messageReceived: ""
      };
    case ownerConstants.OWNER_FETCH_NEW_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.orders
      };
    case ownerConstants.OWNER_FETCH_CONFIRMED_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.orders
      };
    case ownerConstants.OWNER_FETCH_PREPARING_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.orders
      };
    case ownerConstants.OWNER_FETCH_READY_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.orders
      };
    case ownerConstants.OWNER_FETCH_CANCELLED_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.orders
      };
    case ownerConstants.FETCH_PAST_ORDER_SUCCESS:
      return {
        ...state,
        pastOrders: action.orders
      };
    case ownerConstants.OWNER_DETAILS_SUCCESS:
      return {
        ...state,
        details: action.details
      };
    case ownerConstants.OWNER_UPDATE_FAILURE:
      return {
        ...state,
        details: action.details
      };
    case ownerConstants.OWNER_UPDATE_SUCCESS:
      return {
        ...state,
        details: action.details
      };
    case ownerConstants.OWNER_GET_SECTIONS_SUCCESS:
      return {
        ...state,
        sections: action.sections
      };
    case ownerConstants.OWNER_GET_ITEMS_SUCCESS:
        return {
          ...state,
          items: action.items
        };
    default:
      return state
  }
}