import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './path/pathSlice';
import chatReducer from './chat/chatSlice';

export const store = configureStore({
  reducer: {
    currentRepoPath: pathReducer,
    chat: chatReducer
  },
  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;