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

export default function CoinBot() {
  const { isLoadingUserStorageData } = useAuth();

  const router = useRouter();

  const user = storageUserGet()

  if (!user) {
    router.push("login");
  }

  return (
    <>
      {isLoadingUserStorageData ? (
        <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col pb-12 items-center justify-center">
          <MainLoading size="md" />
        </div>
      ) : (
        <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col pb-12">
          <MainHeader chosenPage="CoinBot" style={{ marginBottom: 12 }} />
          <div className="flex md:flex-row flex-col items-center justify-center mb-20 md:gap-4 gap-8">
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
              Olá, meu nome é Coinbot, seu assistente virtual de investimentos!
            </motion.p>
            <Lottie
              animationData={coinBotAnimation}
              style={{ height: 300, width: 300 }}
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-[-60px]">
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
}
