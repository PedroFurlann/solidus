"use client";
import { ChatBot } from "@/components/ChatBot";
import { MainHeader } from "@/components/MainHeader";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import coinBotAnimation from "../../lib/lottie/coinBot.json";
import { storageUserGet } from "@/storage/storageUser";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { MainLoading } from "@/components/MainLoading";
import { RootState, addMessage, clearChatHistory } from "@/store/store";
import { api } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import useWindowSize from "@/hooks/useWindowsSize";
import Popup from "reactjs-popup";
import { X } from "phosphor-react";
import { Footer } from "@/components/Footer";

export interface MessagesProps {
  content: string;
  isUserMessage: boolean;
  userId: number;
  id: number;
  createdAt: Dayjs;
}

export default function CoinBot() {
  const [loading, setLoading] = useState(false);
  const [modalDeleteMessagesHistoricOpen, setModalDeleteMessagesHistoricOpen] =
    useState(false);

  const chatHistory = useSelector((state: RootState) => state.chat.chatHistory);
  const loadingMessage = useSelector((state: RootState) => state.chat.loading);

  const { width } = useWindowSize();

  function handleOpenModalDeleteMessagesHistoric() {
    setModalDeleteMessagesHistoricOpen(true);
  }

  function handleCloseModalDeleteMessagesHistoric() {
    setModalDeleteMessagesHistoricOpen(false);
  }

  const { isLoadingUserStorageData } = useAuth();

  const dispatch = useDispatch();

  const router = useRouter();

  const user = storageUserGet();

  if (!user && typeof window !== "undefined") {
    router.push("/login");
  }

  async function initializeChatHistory() {
    setLoading(true);

    try {
      const response = await api.get("/messages");

      if (response.data.messages.length > 0) {
        response.data.messages &&
          response.data.messages.forEach((message: MessagesProps) => {
            dispatch(
              addMessage({
                content: message.content,
                isUserMessage: message.isUserMessage,
              })
            );
          });
      }
    } catch (error) {
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar o histórico de mensagens. Tente novamente mais tarde.";

      toast.error(title, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      initializeChatHistory();
    }, 1);
  }, []);

  async function handleDeleteMessagesHistoric() {
    setLoading(true);
    try {
      await api.delete("/messages");
      dispatch(clearChatHistory());
      toast.success("Histórico de mensagens deletado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } catch (error) {
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível deletar o histórico de mensagens. Tente novamente mais tarde.";

      toast.error(title, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  function DialogDeleteMessagesHistoric() {
    return (
      <>
        <Popup
          modal
          nested
          overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
          onClose={handleCloseModalDeleteMessagesHistoric}
          open={modalDeleteMessagesHistoricOpen}
        >
          <div
            className="bg-gray-800 py-8 px-6 flex flex-col rounded-xl"
            style={{
              width:
                width > 768 ? 700 : width > 500 ? 460 : width > 400 ? 380 : 320,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-200 text-xl font-bold">
                Excluir histórico de mensagens
              </p>
              <X
                className="text-red-500 cursor-pointer hover:opacity-70 duration-300 ease-in-out transition-all"
                size={32}
                onClick={handleCloseModalDeleteMessagesHistoric}
              />
            </div>
            <p className="text-gray-200 text-lg font-bold mb-10">
              Tem certeza que deseja deletar seu histórico de mensagens com o
              Coin Bot? Essa ação não poderá ser revertida.
            </p>
            <div className="flex items-center justify-end gap-8">
              <button
                onClick={handleCloseModalDeleteMessagesHistoric}
                className="py-2 w-40 border rounded-lg border-red-500 ease-in-out duration-300 cursor-pointer hover:bg-red-500 hover:text-gray-200  text-lg font-bold text-red-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeleteMessagesHistoric();
                  handleCloseModalDeleteMessagesHistoric();
                }}
                className="py-2 hover:bg-amber-400 rounded-lg hover:text-gray-200 w-40 border ease-in-out duration-300 border-amber-400 text-lg font-bold text-amber-400"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Popup>
      </>
    );
  }

  return (
    <>
      {isLoadingUserStorageData || loading ? (
        <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col pb-12 items-center justify-center">
          <MainLoading size="md" />
        </div>
      ) : (
        <>
          <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col pb-12">
            <MainHeader chosenPage="CoinBot" style={{ marginBottom: 12 }} />
            <div className="flex md:flex-row flex-col items-center justify-center mb-16 mt-4 md:gap-4 gap-8">
              <motion.p
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5 }}
                className="text-center text-gray-200 font-bold text-2xl"
                style={{
                  maxWidth: "80%",
                  textAlign: "center",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                Olá, meu nome é Coin bot seu assistente virtual de
                investimentos. Como posso te ajudar hoje?
              </motion.p>
              <Lottie
                animationData={coinBotAnimation}
                style={{ height: 300, width: 300 }}
              />
            </div>
            <div className="flex flex-col items-center justify-center mt-[-116px] gap-6">
              <ChatBot />
              <DialogDeleteMessagesHistoric />
              <button
                className="px-4 py-3 bg-red-500 text-gray-200 font-semibold rounded-2xl focus:outline-none cursor-pointer hover:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-400 transition-all ease-in-out duration-300"
                disabled={loading || chatHistory.length <= 1 || loadingMessage}
                onClick={handleOpenModalDeleteMessagesHistoric}
              >
                Limpar histórico de mensagens
              </button>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
