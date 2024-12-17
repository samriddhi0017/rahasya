import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    messages: messageReducer,
    user: userReducer,
  },
});

