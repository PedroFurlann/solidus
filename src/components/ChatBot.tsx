"use client"

import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageToChatbot, addMessage, ChatMessage } from '../store/store';
import { RootState } from '../store/store'; // Importando o RootState corretamente
import { Loading } from './Loading';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

// Importando o componente de loading

export function ChatBot() {
  const chatHistory = useSelector((state: RootState) => state.chat.chatHistory); // Utilizando o RootState corretamente
  const loading = useSelector((state: RootState) => state.chat.loading); // Utilizando o RootState corretamente
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState<string>('');

  const handleInputMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    dispatch(addMessage({ message: inputMessage, isUser: true }));
    setInputMessage('');

    dispatch(sendMessageToChatbot(inputMessage) as any);
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-white shadow-md">
      <div className="overflow-y-scroll max-h-48">
        {chatHistory.map((entry: ChatMessage, index: number) => (
          <div key={index} className={`p-2 ${entry.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`bg-${entry.isUser ? 'blue-300' : 'green-300'} p-2 rounded-lg inline-block`}>
              {entry.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputMessageChange}
          className="flex-1 border rounded-md px-2 py-1 focus:outline-none"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-md focus:outline-none"
        >
          Enviar
        </button>
      </div>

      {/* Componente de loading */}
      {loading && <Loading /> }
      
    </div>
  );
}
