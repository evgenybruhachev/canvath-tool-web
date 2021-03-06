import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './styles/styles.scss';
import '../src/assets/js/jquery-1.7.1.min.js';
import '../src/components/color-picker/jquery.wheelcolorpicker.js';

import '../src/utils/onbeforeunload';

import App from './containers/App';

import configure from './store';

const store = configure();


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
