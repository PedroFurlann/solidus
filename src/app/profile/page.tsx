"use client";
import { Avatar } from "@/components/Avatar";
import { MainHeader } from "@/components/MainHeader";
import { MainLoading } from "@/components/MainLoading";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { storageUserGet } from "@/storage/storageUser";
import { AppError } from "@/utils/AppError";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

interface FormData {
  name: string;
  email: string;
  new_password: string;
  confirm_new_password: string;
}

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const { updateUserProfile, user, isLoadingUserStorageData } = useAuth();

  const router = useRouter();

  const user2 = storageUserGet()

  if (!user2) {
    router.push("login");
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(6, "O nome deve conter no mímimo 6 caracteres."),
    email: yup
      .string()
      .trim()
      .required("O e-mail é obrigatório.")
      .email("Digite um e-mail válido."),
    new_password: yup
      .string()
      .trim()
      .min(6, "A senha deve conter no mínimo 6 caracteres."),
    confirm_new_password: yup
      .string()
      .trim()
      .oneOf([yup.ref("new_password")], "As senhas devem coincidir"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: user2?.name,
      email: user2?.email,
      new_password: undefined
    },
  });

  async function handleUpdateProfile({
    name,
    new_password,
  }: FormData) {
    let userData = {
      name,
      password: new_password,
    };

    setLoading(true);

    try {
      const userUpdated = user2;

      console.log(user, userData, "user")

      userUpdated.name = name


      await api.patch("/user", userData);
      await updateUserProfile(userUpdated);
      reset()
      router.push("transactions")


      toast.success("Usuário atualizado com sucesso.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        }
      })

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar o usuário. Tente novamente mais tarde.";

        toast.error(title, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }
        })
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading || isLoadingUserStorageData ? (
        <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col items-center justify-center">
          <MainLoading size="md" />
        </div>
      ) : (
        <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col">
          <MainHeader chosenPage="Profile" style={{ marginBottom: 120 }} />

          <div className="flex flex-col justify-center items-center md:px-8 px-4 py-8">
            <Avatar size="profileSize" style={{ marginBottom: 16 }} />
            <p className="text-amber-400 text-2xl font-extrabold mb-16 cursor-pointer hover:opacity-70 transition-all duration-300">
              Alterar Foto
            </p>
            <div className="flex flex-col gap-6 items-center justify-center md:w-80">
              <input
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
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
                className="border border-gray-300 px-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-400 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
                type="email"
                placeholder="E-mail"
                disabled
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.email.message}
                </p>
              )}

              <div className="relative w-full">
                <input
                  className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 w-full"
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

              <input
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700 w-full"
                type={showPassword ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                {...register("confirm_new_password")}
              />
              {errors.confirm_new_password && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.confirm_new_password.message}
                </p>
              )}

              <button
                type="submit"
                onClick={handleSubmit(handleUpdateProfile)}
                className="bg-amber-400 w-full transition-all ease-in-out duration-300 hover:opacity-70 rounded-md py-4 text-gray-100 text-md font-extrabold"
              >
                Atualizar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
