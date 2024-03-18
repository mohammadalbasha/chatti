import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConversation: {},
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    fetchConverations: (state, action) => {
      const { conversations } = action.payload;
      state.conversations = [...conversations];
    },
    selectConversation: (state, action) => {
      const { conversation } = action.payload;
      state.selectedConversation = conversation;
    },
    addConversation: (state, action) => {
      const { conversation } = action.payload;
      state.conversations.push(conversation);
    },
  },
});

export const { fetchConverations, selectConversation, addConversation } =
  conversationsSlice.actions;

const conversationsReducer = conversationsSlice.reducer;
export default conversationsReducer;
