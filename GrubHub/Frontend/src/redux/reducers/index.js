import { combineReducers } from 'redux';


import { users } from './users.reducer';
import { owner } from './owner.reducer';
import { alert } from './alert.reducer';
const rootReducer = combineReducers({ users,
    alert,owner
});

export default rootReducer;