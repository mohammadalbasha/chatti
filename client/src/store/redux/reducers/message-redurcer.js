import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: {},
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    fetchMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage: (state, action) => {
      const { conversation, ...message } = action.payload;
      console.log(conversation, message, action.payload);
      state.messages[conversation]
        ? state.messages[conversation].push(message)
        : (state.messages[conversation] = [message]);
    },
  },
});

export const { fetchMessages, addMessage } = messagesSlice.actions;

const messagesReducer = messagesSlice.reducer;
export default messagesReducer;
