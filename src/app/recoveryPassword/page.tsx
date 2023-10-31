"use client";

import { LoginHeader } from "@/components/LoginHeader";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeSlash } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MainLoading } from "@/components/MainLoading";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components/Footer";

interface FormData {
  new_password: string;
  confirm_new_password: string;
}

export default function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    new_password: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirm_new_password: yup
      .string()
      .oneOf([yup.ref("new_password")], "As senhas devem coincidir")
      .required("Confirme sua senha."),
  });

  const searchParams = useSearchParams();

  const param = searchParams?.get("asdfghiieiiasmdiwmdwamdiwadwamkd");

  if (param) {
    var email = atob(param);
  }

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  async function handleRecoveryPassword({ new_password }: FormData) {
    setLoading(true);

    try {
      await api.post("/reset-password", {
        email,
        new_password,
      });
      reset();
      router.push("login");
      toast.success("Senha redefinida com sucesso!", {
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
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível redefinir sua senha. Tente novamente mais tarde.";

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

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex flex-col bg-black overflow-y-auto items-center justify-center">
          <MainLoading size="md" />
        </div>
      ) : (
        <>
          <div className="min-h-screen flex flex-col bg-black overflow-y-auto">
            <LoginHeader />
            <div className="px-6  py-20 flex flex-col items-center justify-center flex-grow  gap-10">
              <p className="text-3xl text-white font-bold">
                Redefinir senha
              </p>

              <div className="sm:w-[600px] sm:bg-gray-900 w-full rounded-lg sm:p-12 p-3 flex flex-col gap-8 bg-transparent">
                <div className="w-full flex flex-col gap-6">
                  <div className="relative w-full">
                    <input
                      className="border border-gray-300 px-4 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 w-full"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nova senha"
                      {...register("new_password")}
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
                  {errors.new_password && (
                    <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                      {errors.new_password.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <input
                    className="border border-gray-300 px-4 py-4 mb-6  rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 w-full"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    {...register("confirm_new_password")}
                  />

                  {errors.confirm_new_password && (
                    <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                      {errors.confirm_new_password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit(handleRecoveryPassword)}
                  className="bg-amber-400 w-full transition-all ease-in-out duration-300 hover:opacity-70 rounded-md py-4 text-gray-100 text-md font-extrabold"
                >
                  Redefinir senha
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
