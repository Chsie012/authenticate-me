// src/store/index.js (updated)
import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session.js';
import { restoreCSRF, csrfFetch } from './csrf.js';

const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV !== 'production') {
      const logger = require('redux-logger').default;
      return getDefaultMiddleware().concat(logger);
    }
    return getDefaultMiddleware();
  },
  devTools: process.env.NODE_ENV !== 'production',
});

if (process.env.NODE_ENV !== 'production') {
    restoreCSRF();

    window.csrfFetch = csrfFetch;
    window.store = store;
  }

export default store;
