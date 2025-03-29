// src/store/index.js (updated)
import { configureStore } from '@reduxjs/toolkit';
import testReducer from './testSlice';

const store = configureStore({
  reducer: {
    test: testReducer,
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

export default store;
