// src/store/testSlice.js
import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
  name: 'test',
  initialState: {
    value: 'Hello Redux!'
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { setValue } = testSlice.actions;
export default testSlice.reducer;
