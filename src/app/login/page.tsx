"use client";
import { LoginHeader } from "@/components/LoginHeader";
import Lottie from "lottie-react";
import moneyAnimation from "@/lib/lottie/money.json";
import useWindowSize from "@/hooks/useWindowsSize";
import { useState } from "react";
import { Eye, EyeSlash } from "phosphor-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AppError } from "@/utils/AppError";
import { storageUserGet } from "@/storage/storageUser";
import { MainLoading } from "@/components/MainLoading";
import { toast } from "react-toastify";
import { Footer } from "@/components/Footer";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const { isMobile, width } = useWindowSize();

  const { signIn, isLoadingUserStorageData, user } = useAuth();

  const router = useRouter();

  const user2 = storageUserGet();

  if (user2 && typeof window !== "undefined") {
    router.push("/transactions");
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("O e-mail é obrigatório")
      .email("Digite um e-mail válido"),
    password: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 caracteres"),
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  async function handleSignIn({ email, password }: FormData) {
    setLoading(true)
    try {
      await signIn(email, password);
      router.push("/transactions");

      toast.success("Login realizado com sucesso!", {
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
        : "Não foi possível realizar o login. Tente novamente mais tarde.";

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
      {isLoadingUserStorageData || loading ? (
        <div className="min-h-screen flex flex-col bg-black overflow-y-auto items-center justify-center">
          <MainLoading size="sm" />
        </div>
      ) : (
        <>
          <div className="min-h-screen flex flex-col bg-black overflow-y-auto">
            <LoginHeader />
            <div className="px-6  py-20 flex flex-col items-center justify-center flex-grow md:flex-row gap-12 md:gap-24">
              <Lottie
                animationData={moneyAnimation}
                loop={true}
                style={{
                  width: width < 768 ? 220 : width < 1300 ? 300 : 330,
                  height: width < 768 ? 220 : width < 1300 ? 300 : 330,
                }}
              />
              <div className="flex flex-col gap-6 items-center justify-center md:w-80">
                <p className="text-2xl text-white font-bold">Login</p>

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

                <button
                  type="submit"
                  onClick={handleSubmit(handleSignIn)}
                  className="bg-amber-400 w-full transition-all ease-in-out duration-300 hover:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-400 rounded-md py-3 text-white text-md font-extrabold"
                  disabled={isSubmitting || isLoadingUserStorageData || loading}
                >
                  Entrar
                </button>
               <div className="flex flex-col items-start justify-center gap-4 mt-2">
               <p className="font-bold text-lg text-white">
                  Ainda não possui uma conta?{" "}
                  <Link
                    href="/register"
                    className="text-amber-500 text-lg font-bold hover:opacity-70 transition-all ease-in-out duration-300"
                  >
                    Cadastre-se aqui
                  </Link>
                </p>
                <p className="font-bold text-lg text-white">
                  Esqueceu sua senha?{" "}
                  <Link
                    href="/forgotPassword"
                    className="text-amber-500 text-lg font-bold hover:opacity-70 transition-all ease-in-out duration-300"
                  >
                    Clique aqui para recuperar.
                  </Link>
                </p>
               </div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}
