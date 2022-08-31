import { configureStore } from "@reduxjs/toolkit";
import { roomsApi } from "./api/roomsApi";
import { directApi } from "./api/directApi";
import { roomApi } from "./api/roomApi";
import userReducer from "./slices/user";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: rootReducer,

    [roomsApi.reducerPath]: roomsApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [directApi.reducerPath]: directApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      roomsApi.middleware,
      roomApi.middleware,
      directApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
