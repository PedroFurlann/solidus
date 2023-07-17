"use client";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import coinStackAnimation from "@/lib/lottie/coinStack.json";
import useWindowSize from "@/hooks/useWindowsSize";
import computerAnimation from "@/lib/lottie/computer.json";
import Link from "next/link";

export default function Home() {
  const { isMobile } = useWindowSize();

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 overflow-y-auto md:py-12 md:px-12">
      <div className="flex justify-center items-center mt-[-100px] mb-0">
        <motion.p
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-amber-400 font-extrabold font-mono text-6xl self-center mt-4"
        >
          SOLIDUS
        </motion.p>
        <Lottie
          animationData={coinStackAnimation}
          loop={true}
          style={{ width: isMobile ? 180 : 300, height: isMobile ? 180 : 300 }}
        />
      </div>
      <div className="flex flex-col justify-center items-center mb-8">
        <motion.p
          initial={{ opacity: 0, x: 100 }}
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
          Solidus, a solução definitiva para sua gestão financeira pessoal.
        </motion.p>
      </div>
      <div className="flex md:flex-row flex-col md:gap-36 gap-6 items-center justify-center">
        <div className="w-80">
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="text-center text-gray-200 font-bold text-2xl"
            style={{
              textAlign: "center",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            A SOLIDUS é a solução perfeita para você que busca controlar de
            forma mais organizada suas finanças. A aplicação conta com
            funcionalidades como: registar transações, visualizar seus gastos e
            ganhos ao longo do tempo e no final te dar um resumo do seu balanço
            financeiro. Além de contar com um assistente virtual que é capaz de
            realizar boas dicas e indicações de investimentos condizentes com
            sua realidade. Não perca tempo e se registre já para usufruir desses
            benefícios!
          </motion.p>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <Lottie
            animationData={computerAnimation}
            loop={true}
            style={{
              width: isMobile ? 180 : 300,
              height: isMobile ? 180 : 300,
            }}
          />
          <motion.p
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="text-center text-gray-200 font-bold text-lg"
            style={{
              textAlign: "center",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            Já possui conta ou quer usar sua conta Google?{" "}
            <Link
              href="/login"
              className="text-amber-500 text-lg font-bold hover:opacity-70 transition-all ease-in-out duration-300"
            >
              Faça login
            </Link>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="text-center text-gray-200 font-bold text-lg"
            style={{
              textAlign: "center",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            Ainda não possui uma conta?{" "}
            <Link
              href="/register"
              className="text-amber-500 text-lg font-bold hover:opacity-70 transition-all ease-in-out duration-300"
            >
              Cadastre-se aqui
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
