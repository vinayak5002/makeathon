import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChatMessage } from "../../types/types";


type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;  
}

const initialState: ChatState = {
  messages: [],
  loading: true,
  error: null
}

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
});

export const { addMessage, clearMessages } = ChatSlice.actions;

export default ChatSlice.reducer;