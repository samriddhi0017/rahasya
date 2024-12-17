import { createSlice } from '@reduxjs/toolkit';
import AuthService from '../services/AuthService';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, setStatus, setError, logout } = userSlice.actions;

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const user = await AuthService.login(email, password);
    dispatch(setUser(user));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setStatus('failed'));
    dispatch(setError(error.toString()));
  }
};

export default userSlice.reducer;
