import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

import { AppContainer } from 'react-hot-loader';

import App from 'containers/App/index';
import store from 'store/index';

const renderApp = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById('root'),
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('containers/App/index', () => renderApp(App));
}
