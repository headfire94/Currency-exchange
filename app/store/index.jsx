import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import createSagaMiddleware from 'redux-saga'
import exchange, {exchangeSaga} from 'modules/exchange';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(exchange, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(exchangeSaga);

export default store;

if (module.hot) {
  module.hot.accept('modules/exchange', () => {
    const nextReducer = require('modules/exchange').default;

    store.replaceReducer(nextReducer);
  });
}
