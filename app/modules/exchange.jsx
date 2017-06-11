//  Ducks Modular Redux pattern
import {
    delay,
    eventChannel
} from 'redux-saga';
import {
    call,
    put,
    fork,
    take,
    takeEvery,
    select
} from 'redux-saga/effects';
import {
    handleActions,
    createAction,
    combineActions
} from 'redux-actions';
import {combineReducers} from 'redux';

import api from 'services/api';

// ACTIONS
const FETCH_CURRENCIES_REQUEST = 'currency/exchange/FETCH_CURRENCIES_REQUEST';
const FETCH_CURRENCIES_SUCCESS = 'currency/exchange/FETCH_CURRENCIES_SUCCESS';
const FETCH_CURRENCIES_FAILURE = 'currency/exchange/FETCH_CURRENCIES_FAILURE';
const ONLINE = 'currency/exchange/ONLINE';
const OFFLINE = 'currency/exchange/OFFLINE';
const CHANGE_FROM_SELECT = 'currency/exchange/CHANGE_FROM_SELECT';
const CHANGE_TO_SELECT = 'currency/exchange/CHANGE_TO_SELECT';
const CHANGE_TO_VALUE = 'currency/exchange/CHANGE_TO_VALUE';
const CHANGE_FROM_VALUE = 'currency/exchange/CHANGE_FROM_VALUE';
const CHANGE_TO_VALUE_MANUAL = 'currency/exchange/CHANGE_TO_VALUE_MANUAL';
const CHANGE_FROM_VALUE_MANUAL = 'currency/exchange/CHANGE_FROM_VALUE_MANUAL';

// ACTION CREATORS
export const fetchCurrenciesRequest = createAction(FETCH_CURRENCIES_REQUEST);
export const fetchCurrenciesSuccess = createAction(FETCH_CURRENCIES_SUCCESS);
export const fetchCurrenciesFailure = createAction(FETCH_CURRENCIES_FAILURE);
export const online = createAction(ONLINE);
export const offline = createAction(OFFLINE);
export const changeFromCurrencySelect = createAction(CHANGE_FROM_SELECT);
export const changeToCurrencySelect = createAction(CHANGE_TO_SELECT);
export const changeFromValue = createAction(CHANGE_FROM_VALUE);
export const changeToValue = createAction(CHANGE_TO_VALUE);
export const changeFromValueManual = createAction(CHANGE_FROM_VALUE_MANUAL);
export const changeToValueManual = createAction(CHANGE_TO_VALUE_MANUAL);

// REDUCERS
const currencies = handleActions({
    [fetchCurrenciesSuccess]: (state, action) => ({
        USD: action.payload.USD,
        EUR: action.payload.EUR,
        GBP: action.payload.GBP
    })
}, {});

const fromCurrencySelect = handleActions({
    [changeFromCurrencySelect]: (state, action) => action.payload
}, 'USD');

const toCurrencySelect = handleActions({
    [changeToCurrencySelect]: (state, action) => action.payload
}, 'EUR');

const fromValue = handleActions({
    [combineActions(changeFromValue, changeFromValueManual)]: (state, action) => action.payload
}, '');

const toValue = handleActions({
    [combineActions(changeToValue, changeToValueManual)]: (state, action) => action.payload
}, '');

const exchange = combineReducers({
    currencies,
    fromValue,
    fromCurrencySelect,
    toCurrencySelect,
    toValue
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

function* fetchFXRates() {
    while (true) {
        try {
            yield put(fetchCurrenciesRequest());
            const rates = yield call(api.getFXRates);
            yield put(fetchCurrenciesSuccess(rates));
        } catch (e) {
            yield put(fetchCurrenciesFailure(e));
        }
        yield call(delay, 10000);
    }
}

/**
 * cancel fetching FXRates if page isn't visible
 */
function* manager() {
    while (true) {
        const task = yield fork(fetchFXRates);
        yield take(OFFLINE);
        task.cancel();
        yield take(ONLINE);
    }
}

function* watcher() {
    const channel = createVisibilityChannel();
    while (true) {
        const action = (yield take(channel)) ? offline() : online();
        yield put(action);
    }
}

function* calculateToValue(action) {
    try {
        const {toCurrencySelect, fromCurrencySelect, currencies, fromValue} = yield select(state => state);
        const preparedValue = Number(fromValue);
        const factor = currencies[toCurrencySelect] / currencies[fromCurrencySelect];
        const calculatedValue = (preparedValue * factor).toString();
        yield put(changeToValueManual(calculatedValue));
    } catch (e) {
        console.error(e);
    }
}

function* calculateFromValue(action) {
    try {
        const {toCurrencySelect, fromCurrencySelect, currencies, toValue} = yield select(state => state);
        const preparedValue = Number(toValue);
        const factor = currencies[fromCurrencySelect] / currencies[toCurrencySelect];
        const calculatedValue = (preparedValue * factor).toString();
        yield put(changeFromValueManual(calculatedValue));
    } catch (e) {
        console.error(e);
    }
}

export function* exchangeSaga() {
    yield fork(watcher);
    yield fork(manager);
    yield takeEvery(CHANGE_FROM_VALUE, calculateToValue);
    yield takeEvery(CHANGE_TO_VALUE, calculateFromValue);
    yield takeEvery(CHANGE_FROM_SELECT, calculateToValue);
    yield takeEvery(CHANGE_TO_SELECT, calculateToValue);
}