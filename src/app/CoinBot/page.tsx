import { ChatBot } from "@/components/ChatBot";
import { MainHeader } from "@/components/MainHeader";

export default function CoinBot() {
  return (
    <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col">
      <MainHeader chosenPage="CoinBot" style={{ marginBottom: 48 }} />

      <ChatBot />
    </div>

  )
}