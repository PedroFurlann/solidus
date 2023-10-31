"use client";
import { storageUserGet } from "@/storage/storageUser";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import useWindowSize from "@/hooks/useWindowsSize";
import NotFoundAnimation from "@/lib/lottie/404.json";
import { LoginHeader } from "@/components/LoginHeader";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  const { isMobile } = useWindowSize();

  const router = useRouter();

  const user = storageUserGet();

  if (user && typeof window !== "undefined") {
    setTimeout(() => {
      window.location.href = "http://solidusapp.com.br/transactions";
    }, 5000);
  }

  if (!user && typeof window !== "undefined") {
    setTimeout(() => {
      window.location.href = "http://solidusapp.com.br/login";
    }, 5000);
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-black overflow-y-auto">
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

          <p
            className={`${
              isMobile ? "text-lg" : "text-3xl"
            } text-white font-bold text-center`}
          >
            Página não encontrada. Você será redirecionado em alguns
            instantes...
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
