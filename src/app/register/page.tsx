"use client";
import { LoginHeader } from "@/components/LoginHeader";
import Lottie from "lottie-react";
import goldBarAnimation from "@/lib/lottie/goldBar.json";
import useWindowSize from "@/hooks/useWindowsSize";
import { Eye, EyeSlash } from "phosphor-react";
import { useState } from "react";

export default function Register() {
  const { isMobile } = useWindowSize();

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 overflow-y-auto">
      <LoginHeader />
      <div className="px-6  py-20 flex flex-col items-center justify-center flex-grow md:flex-row gap-12 md:gap-24">
        <Lottie
          animationData={goldBarAnimation}
          loop={true}
          style={{ width: isMobile ? 180 : 300, height: isMobile ? 180 : 300 }}
        />
        <div className="flex flex-col gap-6 items-center justify-center md:w-80">
          <p className="text-3xl text-gray-200 font-bold">Cadastre sua conta</p>
          <input
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
            type="email"
            placeholder="Escolha um nome"
          />

          <input
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
            type="email"
            placeholder="Escolha seu email"
          />
          <div className="relative w-full">
            <input
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 w-full"
              type={showPassword ? "text" : "password"}
              placeholder="Cadastre sua senha"
            />
            {showPassword ? (
              <Eye
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
                size={20}
                onClick={handleTogglePassword}
              />
            ) : (
              <EyeSlash
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
                size={20}
                onClick={handleTogglePassword}
              />
            )}
          </div>
          <input
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 w-full"
            type={showPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
          />
          <button className="bg-amber-400 w-full transition-all ease-in-out duration-300 hover:opacity-70 rounded-md py-4 text-gray-100 text-md font-extrabold">
            Cadastrar-se
          </button>
        </div>
      </div>
    </div>
  );
}