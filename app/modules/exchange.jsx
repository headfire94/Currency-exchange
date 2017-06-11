//  Ducks Modular Redux pattern
import { delay, eventChannel } from 'redux-saga';
import { call, put, fork, take, select } from 'redux-saga/effects';
import {
  handleActions,
  createAction,
  combineActions,
} from 'redux-actions';
import { combineReducers } from 'redux';

import api from 'services/api';

// ACTIONS
const FETCH_CURRENCIES_REQUEST = 'currency/exchange/FETCH_CURRENCIES_REQUEST';
const FETCH_CURRENCIES_SUCCESS = 'currency/exchange/FETCH_CURRENCIES_SUCCESS';
const FETCH_CURRENCIES_FAILURE = 'currency/exchange/FETCH_CURRENCIES_FAILURE';
const ONLINE = 'currency/exchange/ONLINE';
const OFFLINE = 'currency/exchange/OFFLINE';

// ACTION CREATORS
export const fetchCurrenciesRequest = createAction(FETCH_CURRENCIES_REQUEST);
export const fetchCurrenciesSuccess = createAction(FETCH_CURRENCIES_SUCCESS);
export const fetchCurrenciesFailure = createAction(FETCH_CURRENCIES_FAILURE);
export const online = createAction(ONLINE);
export const offline = createAction(OFFLINE);

// REDUCERS
const currencies = handleActions({
  [fetchCurrenciesRequest]: () => [],
  [fetchCurrenciesSuccess]: (state, action) => action.payload,
}, []);

const exchange = combineReducers({
    currencies
});

export default exchange;

// SIDE_EFFECTS
function createVisibilityChannel() {
    return eventChannel(emit => {
        const change = () => {
            emit(document.hidden);
        };
        document.addEventListener('visibilitychange', change);
        return () => {
            document.removeEventListener('visibilitychange', change);
        };
    });
}

function* watcher() {
    const channel = createVisibilityChannel();
    while (true) {
        const action = (yield take(channel)) ? offline() : online();
        yield put(action);
    }
}
export function* exchangeSaga() {
    yield fork(watcher);
}