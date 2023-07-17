"use client";
import { LoginHeader } from "@/components/LoginHeader";
import Lottie from "lottie-react";
import moneyAnimation from "@/lib/lottie/money.json";
import useWindowSize from "@/hooks/useWindowsSize";
import { useState } from "react";
import { Eye, EyeSlash } from "phosphor-react";
import GoogleIcon from "../../../public/googlcon.svg";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
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
          animationData={moneyAnimation}
          loop={true}
          style={{ width: isMobile ? 250 : 400, height: isMobile ? 250 : 400 }}
        />
        <div className="flex flex-col gap-6 items-center justify-center md:w-80">
          <p className="text-3xl text-gray-200 font-bold">Faça Login</p>
          <input
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
            type="email"
            placeholder="Digite seu email"
          />
          <div className="relative w-full">
            <input
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 w-full"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
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
          <button className="bg-amber-400 w-full transition-all ease-in-out duration-300 hover:opacity-70 rounded-md py-4 text-gray-100 text-md font-extrabold">
            Entrar
          </button>
          <div className="cursor-pointer w-full items-center justify-center rounded-md py-4 bg-white flex gap-4 transition-all ease-in-out duration-300 hover:opacity-70">
            <Image alt="Google icon" src={GoogleIcon} className="w-6 h-6" />
            <p className="font-medium text-gray-800">
              Entrar com a conta Google
            </p>
          </div>
          <p className="font-bold text-lg text-gray-200">
            Ainda não tem conta?{" "}
            <Link
              href="/register"
              className="text-amber-500 text-lg font-bold hover:opacity-70 transition-all ease-in-out duration-300"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
