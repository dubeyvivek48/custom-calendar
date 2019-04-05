import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import reducer from './Components/Calendar/reducer'

const store = createStore(reducer);
ReactDOM.render( <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
