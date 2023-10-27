import { api } from "@/services/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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

const CHATBOT_API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToChatbot = createAsyncThunk<string, { role: string; content: string }[]>(
  "chat/sendMessageToChatbot",
  async (message) => {
    try {
      const response = await axios.post(
        CHATBOT_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful investment and financial assistant, be as friendly as possible.",
            },
            {
              role: "system",
              content: "Give shorter answers, being as succinct as possible",
            },
            ...message,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GPT_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      await api.post("/messages", {
        content: response.data.choices[0].message.content, isUserMessage: false
      })

      return response.data.choices[0].message.content;
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
