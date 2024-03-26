import { combineReducers, configureStore } from "@reduxjs/toolkit";
import roomSlice from "./roomSlice";
import userSlice from "./userSlice";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  user: userSlice, // use userSlice directly instead of importing userReducer separately
  room: roomSlice
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['user'] // only the user state will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable serializable check warning
    }),
});

export const persistor = persistStore(store);
