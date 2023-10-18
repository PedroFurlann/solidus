"use client";
import { storageUserGet } from "@/storage/storageUser";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import useWindowSize from "@/hooks/useWindowsSize";
import NotFoundAnimation from "@/lib/lottie/404.json";
import { LoginHeader } from "@/components/LoginHeader";

export default function NotFound() {
  const { isMobile } = useWindowSize();

  const router = useRouter();

  const user = storageUserGet();

  if (user && typeof window !== "undefined") {
    setTimeout(() => {
      window.location.href = "http://localhost:3000/transactions";
    }, 5000);
  }

  if (!user && typeof window !== "undefined") {
    setTimeout(() => {
      window.location.href = "http://localhost:3000/login";
    }, 5000);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 overflow-y-auto">
      <LoginHeader />
      <div className="px-6  py-20 flex flex-col items-center justify-center flex-grow gap-12">
        <Lottie
          animationData={NotFoundAnimation}
          loop={true}
          style={{
            width: isMobile ? 180 : 340,
            height: isMobile ? 180 : 340,
          }}
        />

        <p className={`${isMobile ? "text-2xl" : "text-3xl"} text-gray-200 font-bold text-center`}>
          Página não encontrada. Você será redirecionado em alguns instantes...
        </p>
      </div>
    </div>
  );
}
