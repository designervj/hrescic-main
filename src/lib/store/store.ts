import { configureStore } from "@reduxjs/toolkit";
import pagesReducer from "./pages/pagesSlice";
import authReducer from "./auth/authSlice";
import commentsReducer from "./comments/commentSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      pages: pagesReducer,
      auth: authReducer,
      comments: commentsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
