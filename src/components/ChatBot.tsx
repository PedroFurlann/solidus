"use client";

import React, { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageToChatbot, addMessage, ChatMessage } from "../store/store";
import { RootState } from "../store/store"; // Importando o RootState corretamente

// Importando o componente de loading

export function ChatBot() {
  const chatHistory = useSelector((state: RootState) => state.chat.chatHistory); // Utilizando o RootState corretamente
  const loading = useSelector((state: RootState) => state.chat.loading); // Utilizando o RootState corretamente
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleInputMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    dispatch(addMessage({ message: inputMessage, isUser: true }));
    setInputMessage("");

    dispatch(sendMessageToChatbot(inputMessage) as any);
  };

  return (
    <div className="py-4 px-8 bg-gray-200 shadow-md h-2/3 w-2/3 flex flex-col justify-center items-center rounded-2xl">
      <div className="overflow-y-auto h-96 w-full">
        {chatHistory.map((entry: ChatMessage, index: number) => (
          <div
            key={index}
            className={`p-2 ${entry.isUser ? "text-right" : "text-left"}`}
          >
            <div
              className={`bg-${
                entry.isUser ? "blue-300" : "green-300"
              } p-2 rounded-lg inline-block`}
            >
              {entry.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex md:flex-row flex-col gap-4 mt-2 w-full items-center justify-center">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputMessageChange}
          className="border flex-1 rounded-md px-2 py-1 focus:outline-none"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-1 bg-amber-400 text-gray-200 rounded-md focus:outline-none cursor-pointer hover:opacity-70 transition-all ease-in-out duration-300"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
