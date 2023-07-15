"use client";
import { LoginHeader } from "@/components/LoginHeader";
import Lottie from "lottie-react";
import moneyAnimation from "@/lib/lottie/money.json";
import useWindowSize from "@/hooks/useWindowsSize";

export default function Login() {
  const { isMobile } = useWindowSize()

  return (
    <div className="h-screen w-full bg-gray-950 overflow-y-auto">
      <LoginHeader />
      <div className="h-max flex flex-col items-center justify-center gap-24 md:flex-row">
        <Lottie
          animationData={moneyAnimation}
          loop={true}
          style={{ width: isMobile ? 100 : 300, height: isMobile ? 100 : 300 }}
        />
        <div className="flex flex-col gap-4 items-center justify-center">
          <input
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-500"
            type="text"
            placeholder="Email"
          />
        </div>
      </div>
    </div>
  );
}
