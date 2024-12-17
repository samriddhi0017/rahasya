import { createSlice } from '@reduxjs/toolkit';
import FirebaseService from '../services/FirebaseService';

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setMessages, setStatus, setError } = messageSlice.actions;

export const fetchMessages = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const messages = await FirebaseService.getMessages();
    dispatch(setMessages(messages));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setStatus('failed'));
    dispatch(setError(error.toString()));
  }
};

export default messageSlice.reducer;

