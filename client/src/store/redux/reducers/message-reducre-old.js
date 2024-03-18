import { createSlice } from "@reduxjs/toolkit";

// const initialState = {};

// const messagesReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "FETCH_MESSAGES_SUCCESS":
//       const { conversationId, messages } = action.payload;
//       return {
//         ...state,
//         [conversationId]: messages,
//       };
//     default:
//       return state;
//   }
// };

// export default messagesReducer;

const initialState = {
  messages: {},
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    fetchMessages: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      console.log("state", state);

      const { conversationId, messages } = state;

      //  state[conversationId] = messages;
    },
  },
});

export const { fetchMessages } = messagesSlice.actions;

const messagesReducer = messagesSlice.reducer;
export default messagesReducer;

// // Fetch messages for the selected conversation
// fetch(`/api/conversations/${conversationId}/messages`)
//   .then((response) => response.json())
//   .then((data) => {
//     dispatch({
//       type: "FETCH_MESSAGES_SUCCESS",
//       payload: { conversationId, messages: data.messages },
//     });
//   })
//   .catch((error) => console.log(error));
