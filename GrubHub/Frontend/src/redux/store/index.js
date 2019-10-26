import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';
import {saveState} from '../localstorage'
const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,composeWithDevTools(applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    ))
    
);

// store.subscribe(() => {
//     saveState({
//       auth: store.getState().auth
//     });
//   });