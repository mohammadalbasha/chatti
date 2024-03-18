// Redux store setup
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import messagesReducer from "./reducers/message-redurcer";
import conversationsReducer from "./reducers/conversation-reducer";

// const rootReducer = combineReducers({
//   messages: messagesReducer,
// });

// const store = configureStore({
//   reducer: rootReducer,
// });

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    conversations: conversationsReducer,
  },
});

export default store;
