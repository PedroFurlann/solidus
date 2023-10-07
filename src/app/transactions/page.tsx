"use client";
import { MainHeader } from "@/components/MainHeader";
import { MainLoading } from "@/components/MainLoading";
import { TransactionCard } from "@/components/TransactionCard";
import useWindowSize from "@/hooks/useWindowsSize";
import { priceFormatter } from "@/utils/priceFormatter";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Popup from "reactjs-popup";
import * as yup from "yup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAuth } from "@/hooks/useAuth";
import { storageUserGet } from "@/storage/storageUser";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { TransactionDTO } from "@/dtos/TransactionDTO";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";
import { storageTokenGet } from "@/storage/storageToken";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FormData {
  title: string;
  amount: number;
}

export default function Transactions() {
  const [modalRegisterTransactionIsOpen, setModalRegisterTransactionIsOpen] =
    useState(false);
  const [selectedType, setSelectedType] = useState("PROFIT");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [typeEmpty, setTypeEmpty] = useState(false);
  const [categoryEmpty, setCategoryEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalDeleteTransactionIsOpen, setModalDeleteTransactionIsOpen] =
    useState(false);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);

  const { isMobile, width } = useWindowSize();

  const { isLoadingUserStorageData, signOut, user } = useAuth();

  const router = useRouter();

  const user2 = storageUserGet();

  if (!user2) {
    router.push("login");
  }

  const categories = [
    "Comida",
    "Saúde",
    "Lazer",
    "Educação",
    "Gastos fixos",
    "Outros",
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: width > 768 ? 18 : 15,
            family: "Roboto",
            weight: "bold",
          },
          color: "#e4e4e7",
        },
      },
      tooltip: {
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: width > 768 ? 18 : 15,
            weight: "bold",
            family: "Roboto",
          },
          color: "#e4e4e7",
        },
      },
      y: {
        ticks: {
          font: {
            size: width > 768 ? 18 : 15,
            weight: "bold",
            family: "Roboto",
          },
          color: "#e4e4e7",
          callback: function (value: any) {
            return "R$ " + value;
          },
        },
      },
    },
  };

  function handleChangeSelectedCategory(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedCategory(event.target.value);
  }

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Gastos R$",
        data: [10, 20.55, 30, 40, 50, 60],
        backgroundColor: "rgba(251, 191, 36, 1)", // Cor das barras
        borderColor: "rgba(245, 158, 11, 1)", // Cor da borda das barras
        borderWidth: 4, // Largura da borda das barras
      },
    ],
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("A descrição da transação é obrigatória"),
    amount: yup
      .number()
      .required("Informe um valor válido!")
      .nonNullable()
      .min(1, "O valor deve ser maior que 0"),
  });

  async function fetchTransactions() {
    setLoading(true);

    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.transactions);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as transações. Tente novamente mais tarde.";

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
    } finally {
      setLoading(false);
    }
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function handleRegisterTransaction({ title, amount }: FormData) {
    if (selectedType === "") {
      setTypeEmpty(true);
      return;
    }

    if (selectedCategory === "" && selectedType === "LOSS") {
      setCategoryEmpty(true);
      return;
    }

    const transactionData = {
      title,
      type: selectedType,
      amount,
      category: selectedType === "LOSS" ? selectedCategory : null,
    };

    setLoading(true);

    try {
      await api.post("/transactions", transactionData);
      fetchTransactions();
      setModalRegisterTransactionIsOpen(false);
      reset();
      toast.success("Transação criada com sucesso.", {
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
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível cadastrar a transação. Tente novamente mais tarde.";

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
  }

  function handleOpenModalRegisterTransaction() {
    setModalRegisterTransactionIsOpen(true);
  }

  function handleCloseModalRegisterTransaction() {
    setModalRegisterTransactionIsOpen(false);
  }

  function handleOpenModalDeleteTransaction() {
    setModalDeleteTransactionIsOpen(true);
  }

  function handleCloseModalDeleteTransaction() {
    setModalDeleteTransactionIsOpen(false);
  }

  function verifyCategoryIsEmpty() {
    if (selectedType === "") {
      setCategoryEmpty(true);
    } else {
      setCategoryEmpty(false);
    }
  }

  useEffect(() => {
    verifyCategoryIsEmpty();
  }, [selectedCategory]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  function DialogRegisterTransaction({ triggerComponent }: any) {
    return (
      <>
        {triggerComponent}
        <Popup
          modal
          nested
          overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
          open={modalRegisterTransactionIsOpen}
        >
          <div
            className="bg-gray-800 py-8 px-6 flex flex-col rounded-xl"
            style={{
              width:
                width > 768 ? 700 : width > 500 ? 460 : width > 400 ? 380 : 320,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-200 text-lg font-bold">Nova Transação</p>
              <X
                className="text-red-500 cursor-pointer hover:opacity-70 duration-300 ease-in-out transition-all"
                size={32}
                onClick={handleCloseModalRegisterTransaction}
              />
            </div>
            <div className="w-full flex flex-col gap-8">
              <input
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
                type="text"
                placeholder="Descrição da transação"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.title.message}
                </p>
              )}
              <input
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
                type="text"
                placeholder="Digite o valor da transação"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.amount.message}
                </p>
              )}
              <div
                className={`flex gap-4 ${
                  selectedType === "LOSS" ? "mb-2" : "mb-10"
                }`}
              >
                <div
                  onClick={() => {
                    setSelectedType("LOSS");
                    setTypeEmpty(false);
                  }}
                  className={`cursor-pointer w-1/2 rounded-2xl py-8 flex items-center justify-center gap-3 border bg-slate-900 ${
                    selectedType === "LOSS"
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                >
                  <p className="text-lg font-bold text-gray-200">Gasto</p>
                  <ArrowCircleDown size={32} className="text-red-500" />
                </div>
                <div
                  onClick={() => {
                    setSelectedType("PROFIT");
                    setTypeEmpty(false);
                    setCategoryEmpty(false);
                    setSelectedCategory("");
                  }}
                  className={`cursor-pointer w-1/2 rounded-2xl py-8 flex items-center justify-center gap-3 border bg-slate-900 ${
                    selectedType === "PROFIT"
                      ? "border-amber-400"
                      : "border-gray-400"
                  }`}
                >
                  <p className="text-lg font-bold text-gray-200">Lucro</p>
                  <ArrowCircleUp size={32} className="text-amber-400" />
                </div>
              </div>
              {typeEmpty && (
                <p className="text-red-500 text-sm font-bold self-start mb-2">
                  Selecione o tipo da transação
                </p>
              )}
              <select
                value={selectedCategory}
                onChange={handleChangeSelectedCategory}
                className={`select-warning p-4 ${
                  categoryEmpty ? "mb-0" : "mb-8"
                } rounded-md ${selectedType === "LOSS" ? "flex" : "hidden"}`}
              >
                <option value="">Selecione a categoria da sua transação</option>
                <option value="FOOD">Comida</option>
                <option value="HEALTH">Saúde</option>
                <option value="FUN">Lazer</option>
                <option value="EDUCATION">Educação</option>
                <option value="FIXED">Gastos Fixos</option>
                <option value="OTHERS">Outros</option>
              </select>
              {categoryEmpty && (
                <p className="text-red-500 text-sm font-bold self-start mb-6">
                  Selecione a categoria da transação
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-8">
              <button
                onClick={handleCloseModalRegisterTransaction}
                className="py-4 w-40 border rounded-lg border-red-500 ease-in-out duration-300 cursor-pointer hover:bg-red-500 hover:text-gray-200  text-lg font-bold text-red-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit(handleRegisterTransaction)}
                className="py-4 hover:bg-amber-400 rounded-lg hover:text-gray-200 w-40 border ease-in-out duration-300 border-amber-400 text-lg font-bold text-amber-400"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Popup>
      </>
    );
  }

  function DialogDeleteTransaction({ title, createdAt, id }: TransactionDTO) {
    async function handleDeleteTransaction() {
      setLoading(true);
      try {
        await api.delete(`/transactions/${id}`);
        handleCloseModalDeleteTransaction();
        fetchTransactions();
        toast.success("Transação deletada com sucesso!", {
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
        console.log(error);
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : "Não foi possível carregar as transações. Tente novamente mais tarde.";

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
      } finally {
        setLoading(false);
      }
    }

    return (
      <>
        <Popup
          modal
          nested
          overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
          open={modalDeleteTransactionIsOpen}
        >
          <div
            className="bg-gray-800 py-8 px-6 flex flex-col rounded-xl"
            style={{
              width:
                width > 768 ? 700 : width > 500 ? 460 : width > 400 ? 380 : 320,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-200 text-lg font-bold">Excluir transação</p>
              <X
                className="text-red-500 cursor-pointer hover:opacity-70 duration-300 ease-in-out transition-all"
                size={32}
                onClick={handleCloseModalDeleteTransaction}
              />
            </div>
            <p className="text-gray-200 text-lg font-bold mb-10">
              Tem certeza que deseja remover a transação {title}, criada em{" "}
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}? Essa ação não
              poderá ser revertida.
            </p>
            <div className="flex items-center justify-end gap-8">
              <button
                onClick={handleCloseModalDeleteTransaction}
                className="py-2 w-40 border rounded-lg border-red-500 ease-in-out duration-300 cursor-pointer hover:bg-red-500 hover:text-gray-200  text-lg font-bold text-red-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTransaction}
                className="py-2 hover:bg-amber-400 rounded-lg hover:text-gray-200 w-40 border ease-in-out duration-300 border-amber-400 text-lg font-bold text-amber-400"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Popup>
      </>
    );
  }

  return (
    <>
      {loading || isLoadingUserStorageData ? (
        <div className="min-h-screen overflow-y-auto bg-gray-950 flex flex-col items-center justify-center">
          <MainLoading size="md" />
        </div>
      ) : (
        <>
          <MainHeader chosenPage="Transactions" />
          <div className="md:py-28 py-6 lg:px-40 px-8 items-center justify-center flex-col md:gap-16 gap-8 min-h-screen overflow-y-auto bg-gray-950">
            <div className="flex md:flex-row flex-col items-center md:justify-between md:gap-0 gap-4 mb-12">
              <p className="text-gray-200 font-bold text-2xl text-center">
                Essas é o resumo de suas transações {user?.name}
              </p>
              <DialogRegisterTransaction
                triggerComponent={
                  <button
                    onClick={handleOpenModalRegisterTransaction}
                    className="rounded-lg bg-amber-400 border-none py-4 px-4 cursor-pointer hover:opacity-70 transition-all ease-in-out duration-300"
                  >
                    <p className="text-gray-50 font-extrabold">
                      Nova Transação
                    </p>
                  </button>
                }
              />
            </div>
            <div
              className={`${
                width > 600 ? "flex" : "hidden"
              } items-center justify-center mb-0`}
            >
              <div
                style={{ width: width > 768 ? 700 : 550, height: 500 }}
                className="flex items-center justify-center self-center place-self-center"
              >
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="w-1/2 h-1/2 flex items-center justify-center self-center place-self-center"></div>
            <div className="w-full flex lg:flex-row gap-14 mb-14 flex-col">
              <div className="w-full h-48 flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-xl">
                <p className="text-xl font-bold text-gray-200">
                  Total de gastos
                </p>
                <div className="flex gap-2 items-center">
                  <p className="text-2xl text-red-500 font-extrabold">
                    - {priceFormatter.format(2850.54)}
                  </p>
                  <ArrowCircleDown className="text-red-500" size={36} />
                </div>
              </div>
              <div className="w-full h-48 flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-xl">
                <p className="text-xl font-bold text-gray-200">Balanço final</p>
                <div className="flex gap-2 items-center">
                  <p className="text-2xl text-red-500 font-extrabold">
                    - {priceFormatter.format(8002.54)}
                  </p>
                  <ArrowCircleDown className="text-red-500" size={36} />
                </div>
              </div>
              <div className="w-full h-48 flex flex-col items-center justify-center gap-6 bg-gray-800 rounded-xl">
                <p className="text-xl font-bold text-gray-200">
                  Total recebido
                </p>
                <div className="flex gap-2 items-center">
                  <p className="text-2xl text-amber-400 font-extrabold">
                    {priceFormatter.format(2000.54)}
                  </p>
                  <ArrowCircleUp className="text-amber-500" size={36} />
                </div>
              </div>
            </div>
            <div className="w-full h-96 flex flex-col py-8 overflow-auto bg-gray-900 md:px-8 px-4 gap-8 rounded-xl">
              {transactions.map((transaction) => (
                <>
                  <TransactionCard
                    key={transaction.id}
                    id={transaction.id}
                    amount={transaction.amount}
                    title={transaction.title}
                    type={transaction.type}
                    category={transaction.category}
                    createdAt={transaction.createdAt}
                    openModalDelete={handleOpenModalDeleteTransaction}
                  />

                  <DialogDeleteTransaction
                    key={transaction.id}
                    id={transaction.id}
                    amount={transaction.amount}
                    title={transaction.title}
                    type={transaction.type}
                    category={transaction.category}
                    createdAt={transaction.createdAt}
                  />
                </>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
