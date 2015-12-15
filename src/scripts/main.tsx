/// <reference path="typings/tsd" />

import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './containers/app'


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)