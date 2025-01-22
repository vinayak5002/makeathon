import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './path/pathSlice';

export const store = configureStore({
  reducer: {
    currentRepoPath: pathReducer,
  },
  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;