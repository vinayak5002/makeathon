import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './path/pathSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
  reducer: {
    currentRepoPath: pathReducer,
    user: userReducer
  },
  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;