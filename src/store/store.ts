import { api } from "@/services/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
  content: string;
  isUserMessage: boolean;
}

export interface ChatState {
  chatHistory: ChatMessage[]; 
  loading: boolean;
}

export interface RootState {
  chat: ChatState;
}

export const sendMessageToChatbot = createAsyncThunk<string, { messages: { role: string; content: string }[] }>(
  "chat/sendMessageToChatbot",
  async ({ messages }) => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.log(error);
      throw new Error(
        "Erro ao se comunicar com o coin bot. Tente novamente mais tarde."
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatHistory: [{ content: "Olá! Como posso ajudar?", isUserMessage: false }] as ChatMessage[],
    loading: false,
  } as ChatState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatHistory.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.chatHistory = [{ content: "Olá! Como posso ajudar?", isUserMessage: false }] as ChatMessage[];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToChatbot.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageToChatbot.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory.push({ content: action.payload, isUserMessage: false });
      })
      .addCase(sendMessageToChatbot.rejected, (state, action) => {
        state.loading = false;

        state.chatHistory.push({
          content:
            action.error.message ??
            "Parece que ocorreu um erro! Tente novamente mais tarde.",
          isUserMessage: false,
        });
      });
  },
});

export const { addMessage, clearChatHistory } = chatSlice.actions;

export default chatSlice.reducer;
