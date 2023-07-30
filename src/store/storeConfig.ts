import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./store";

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

export default store;