import { useState, ChangeEvent, KeyboardEvent, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageToChatbot, addMessage, ChatMessage, clearChatHistory } from "../store/store";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import { api } from "@/services/api";

export function ChatBot() {
  const chatHistory = useSelector((state: RootState) => state.chat.chatHistory);
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadChatHistory = useCallback(async () => {
    try {
      const response = await api.get("/messages");
      
      dispatch(clearChatHistory());
      
      if (!response.data || response.data.length === 0) {
        dispatch(addMessage({ content: "Olá! Como posso ajudar?", isUserMessage: false }));
      } else {
        response.data.forEach((message: ChatMessage) => {
          dispatch(addMessage(message));
        });
      }
    } catch (error) {
      console.log("Erro ao carregar histórico:", error);
      dispatch(clearChatHistory());
      dispatch(addMessage({ content: "Olá! Como posso ajudar?", isUserMessage: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  const handleInputMessageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if(inputMessage.trim().length > 200) {
      return (
        toast.warning("Limite de 200 caracteres ultrapassado", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          },
        })
      )
    }

    const userMessage: ChatMessage = { content: inputMessage, isUserMessage: true };
    dispatch(addMessage(userMessage));

    await api.post("/messages", userMessage)

    setInputMessage("");

    setLoadingMessages(true);

    const messagesToSend: { role: string; content: string }[] = chatHistory.map(
      (message) => ({
        role: message.isUserMessage ? "user" : "assistant",
        content: message.content,
      })
    );

    messagesToSend.push({ role: "user", content: inputMessage });

    await dispatch(sendMessageToChatbot({ messages: messagesToSend }) as any).then(() => {
      setLoadingMessages(false);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };


  return (
    <div className="py-4 pl-8 pr-4 bg-black border-amber-400 border-2 shadow-md h-1/2 w-1/2 flex flex-col justify-center items-center rounded-2xl">
      <div className="overflow-y-auto h-96 w-full">
        {chatHistory.map((entry: ChatMessage, index: number) => (
          <div
            key={index}
            className={`flex mb-8 mr-4  ${
              entry.isUserMessage ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`xl:p-4 lg:p-3 p-2 inline-block chat-bubble break-words chat-bubble-warning`}
              style={{ maxWidth: "70%" }}
            >
              <p className="font-medium text-black">{entry.content}</p>
            </div>
          </div>
        ))}

        {loadingMessages && (
          <div
            className={`flex mb-8 mr-4 justify-start"
        }`}
          >
            <div
              className={`xl:p-4 lg:p-3 p-2 flex items-center justify-center chat-bubble chat-bubble-warning`}
              style={{ maxWidth: "70%" }}
            >
              <div className="loading-dots w-6 h-6 text-black bg-black" />
            </div>
          </div>
        )}
      </div>
      <div className="flex md:flex-row flex-col gap-4 mt-4 w-full items-center justify-center">
        <input
          type="text"
          value={inputMessage}
          onKeyDown={handleKeyDown}
          onChange={handleInputMessageChange}
          className="border flex-1 rounded-md px-4 py-2 focus:outline-none w-full disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="Digite sua mensagem..."
          disabled={loadingMessages}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-amber-400 text-white font-semibold rounded-md focus:outline-none cursor-pointer hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-70 transition-all ease-in-out duration-300"
          disabled={loadingMessages}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
