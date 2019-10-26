import { ownerConstants } from '../constants/owner.constants';

export function owner(state = {}, action) {
  switch (action.type) {
    case ownerConstants.UPDATE_SUCCESS:
        return {
          owner:action.user
        };
    case ownerConstants.UPDATE_FAILURE:
          return {
            owner:action.user
          };
    case ownerConstants.FETCH_SUCCESS:

            return {
              owner:action.user
            };
    default:
      return state
  }
}