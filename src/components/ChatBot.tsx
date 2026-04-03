import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useLayoutEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageToChatbot, addMessage, ChatMessage } from "../store/store";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import { api } from "@/services/api";

export function ChatBot() {
  const chatHistory = useSelector((state: RootState) => state.chat.chatHistory);
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory, loadingMessages]);


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

    try {
      await dispatch(sendMessageToChatbot({ messages: messagesToSend }) as any);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };


  return (
    <div
      className="
        mx-auto flex w-full max-w-full flex-col
        rounded-2xl border-2 border-amber-400 bg-black
        px-5 py-3 shadow-md sm:px-6 sm:py-4 md:px-7 md:py-4
        lg:max-w-4xl lg:px-7 xl:max-w-5xl xl:px-8
        min-h-0
      "
    >
      <div
        ref={scrollContainerRef}
        className="
          h-[15rem] w-full shrink-0
          overflow-x-hidden overflow-y-auto overscroll-contain
          scroll-smooth
          sm:h-[17rem] md:h-[19rem] lg:h-[21rem] xl:h-[22rem]
          pr-1 sm:pr-2
        "
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="flex flex-col gap-4 pb-2 sm:gap-5">
          {chatHistory.map((entry: ChatMessage, index: number) => (
            <div
              key={index}
              className={`flex w-full px-0.5 sm:px-1 ${
                entry.isUserMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className="chat-bubble chat-bubble-warning inline-block max-w-[min(92%,20rem)] break-words p-2 sm:max-w-[min(88%,24rem)] sm:p-3 md:max-w-[min(85%,28rem)] md:p-4 xl:p-4"
              >
                <p className="text-sm font-medium text-black sm:text-base">
                  {entry.content}
                </p>
              </div>
            </div>
          ))}

          {loadingMessages && (
            <div className="flex w-full justify-start px-0.5 sm:px-1">
              <div
                className="chat-bubble chat-bubble-warning flex max-w-[min(92%,20rem)] items-center justify-center p-2 sm:max-w-[min(88%,24rem)] sm:p-3 md:p-4"
                aria-busy="true"
                aria-label="Aguardando resposta"
              >
                <div className="loading-dots h-6 w-6 bg-black text-black" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex w-full flex-shrink-0 flex-col gap-3 border-t border-amber-400/30 pt-3 sm:mt-4 sm:flex-row sm:items-stretch sm:gap-3 sm:pt-4">
        <input
          type="text"
          value={inputMessage}
          onKeyDown={handleKeyDown}
          onChange={handleInputMessageChange}
          className="min-h-[44px] w-full flex-1 rounded-md border border-amber-400/40 bg-white/95 px-3 py-2.5 text-base text-black placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-0 sm:py-2"
          placeholder="Digite sua mensagem..."
          disabled={loadingMessages}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="min-h-[44px] w-full shrink-0 rounded-md bg-amber-400 px-4 py-2.5 font-semibold text-white transition-all duration-300 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[6.5rem] sm:w-auto"
          disabled={loadingMessages}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
