import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ChatMessage {
  message: string;
  isUser: boolean;
}

export interface ChatState {
  chatHistory: ChatMessage[];
  loading: boolean;
}

export interface RootState {
  chat: ChatState
}

const CHATBOT_API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToChatbot = createAsyncThunk<string, string>(
  "chat/sendMessageToChatbot",
  async (message) => {
    try {
      const response = await axios.post(
        CHATBOT_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "assistant",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GPT_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.log(error)
      throw new Error(
        "Erro ao se comunicar com o coin bot. Tente novamente mais tarde."
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatHistory: [{ message: "Olá! Como posso ajudar?" }] as ChatMessage[],
    loading: false,
  } as ChatState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatHistory.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToChatbot.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageToChatbot.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory.push({ message: action.payload, isUser: false });
      })
      .addCase(sendMessageToChatbot.rejected, (state, action) => {
        state.loading = false;

        state.chatHistory.push({
          message:
            action.error.message ??
            "Parece que ocorreu um erro! Tente novamente mais tarde.",
          isUser: false,
        });
      });
  },
});

export const { addMessage, clearChatHistory } = chatSlice.actions;

export default chatSlice.reducer;