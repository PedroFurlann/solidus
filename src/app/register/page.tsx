"use client";
import { LoginHeader } from "@/components/LoginHeader";
import Lottie from "lottie-react";
import goldBarAnimation from "@/lib/lottie/goldBar.json";
import useWindowSize from "@/hooks/useWindowsSize";
import { Eye, EyeSlash } from "phosphor-react";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { storageUserGet } from "@/storage/storageUser";
import { useAuth } from "@/hooks/useAuth";
import { MainLoading } from "@/components/MainLoading";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { Footer } from "@/components/Footer";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirm_password?: string | undefined;
}

export default function Register() {
  const { isMobile, width } = useWindowSize();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  const { isLoadingUserStorageData, signIn } = useAuth();

  const user = storageUserGet();

  if (user && typeof window !== "undefined") {
    router.push("/transactions");
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required("O nome é obrigatório")
      .min(6, "O nome deve conter no mímimo 6 caracteres"),
    email: yup
      .string()
      .required("O e-mail é obrigatório")
      .email("Digite um e-mail válido"),
    password: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "As senhas devem coincidir"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  async function handleSignUp({ name, email, password }: FormData) {
    let userData = {
      name,
      email,
      password,
    };

    setLoading(true)

    try {
      await api.post("/user", userData);
      await signIn(email, password);

      toast.success("Usuário criado com sucesso!", {
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
        : "Não foi possível criar a conta. Tente novamente mais tarde.";

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
      setLoading(false)
    }
  }



  return (
    <>
      {isLoadingUserStorageData ? (
        <div className="min-h-screen flex flex-col bg-black overflow-y-auto">
          <MainLoading size="sm" />
        </div>
      ) : (
        <>
          <div className="min-h-screen flex flex-col bg-black overflow-y-auto">
            <LoginHeader />
            <div className="px-6  py-20 flex flex-col items-center justify-center flex-grow md:flex-row gap-12 md:gap-24">
              <Lottie
                animationData={goldBarAnimation}
                loop={true}
                style={{
                  width: width < 768 ? 180 : width < 1300 ? 250 : 300,
                  height: width < 768 ? 180 : width < 1300 ? 250 : 300,
                }}
              />
              <div className="flex flex-col gap-6 items-center justify-center md:w-80">
                <p className="text-2xl text-white font-bold">
                  Cadastre sua conta
                </p>
                <input
                  className="border bg-white border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-amber-400 w-full"
                  type="email"
                  placeholder="Nome"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                    {errors.name.message}
                  </p>
                )}

                <input
                  className="border bg-white border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-amber-400 w-full"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                    {errors.email.message}
                  </p>
                )}

                <div className="relative w-full">
                  <input
                    className="border bg-white border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-black w-full"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    {...register("password")}
                  />
                  {showPassword ? (
                    <Eye
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
                      size={20}
                      onClick={handleTogglePassword}
                    />
                  ) : (
                    <EyeSlash
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
                      size={20}
                      onClick={handleTogglePassword}
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                    {errors.password.message}
                  </p>
                )}

                <input
                  className="border bg-white border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-black w-full"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                    {errors.confirm_password.message}
                  </p>
                )}

                <button
                  type="submit"
                  onClick={handleSubmit(handleSignUp)}
                  className="bg-amber-400 w-full transition-all disabled:bg-gray-400 disabled:cursor-not-allowed ease-in-out duration-300 hover:opacity-70 rounded-md py-3 text-white text-md font-extrabold"
                  disabled={isSubmitting || isLoadingUserStorageData || loading}
                >
                  Cadastrar-se
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
