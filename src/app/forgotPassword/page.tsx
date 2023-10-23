"use client";

import { LoginHeader } from "@/components/LoginHeader";
import { MainLoading } from "@/components/MainLoading";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

interface FormData {
  email: string;
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("O e-mail é obrigatório.")
      .email("Digite um e-mail válido."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const router = useRouter();

  async function handleSendEmail({ email }: FormData) {
    setLoading(true);

    try {
      await api.post("/forgot-password", { email });
      reset();
      router.push("login");
      toast.success("Email enviado com sucesso!", {
        position: "top-center",
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
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível enviar o email de recuperação. Tente novamente mais tarde.";

      toast.error(title, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    }
    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex flex-col bg-gray-950 overflow-y-auto items-center justify-center">
          <MainLoading size="md" />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col bg-gray-950 overflow-y-auto">
          <LoginHeader />
          <div className="px-6  py-20 flex flex-col items-center justify-center flex-grow gap-12">
          <p className="text-3xl text-gray-200 font-bold">Recuperar senha</p>
            <div className="sm:w-[600px] sm:bg-gray-900 w-full rounded-lg sm:p-12 p-3 flex flex-col gap-6 bg-transparent">
              <div className="w-full">
                <input
                  className="border border-gray-300 px-4 py-4 mb-6 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
                  type="email"
                  placeholder="Digite o email para recuperação"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                onClick={handleSubmit(handleSendEmail)}
                className="bg-amber-400 w-full transition-all ease-in-out duration-300 hover:opacity-70 rounded-md py-4 text-gray-100 text-md font-extrabold"
              >
                Enviar email de recuperação
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
