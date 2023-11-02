"use client";
import { MainHeader } from "@/components/MainHeader";
import { MainLoading } from "@/components/MainLoading";
import { TransactionCard } from "@/components/TransactionCard";
import useWindowSize from "@/hooks/useWindowsSize";
import { priceFormatter } from "@/utils/priceFormatter";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowCircleDown, ArrowCircleUp, MinusCircle, X } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { api } from "@/services/api";
import { TransactionDTO } from "@/dtos/TransactionDTO";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { NumericFormat } from "react-number-format";

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
  amount: string;
}

export default function Transactions() {
  const [modalRegisterTransactionIsOpen, setModalRegisterTransactionIsOpen] =
    useState(false);
  const [selectedType, setSelectedType] = useState("PROFIT");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [typeEmpty, setTypeEmpty] = useState(false);
  const [categoryEmpty, setCategoryEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);

  const { width } = useWindowSize();

  const { isLoadingUserStorageData, user } = useAuth();

  const user2 = storageUserGet();

  const router = useRouter();

  const regex = /^\d*\.?\d+$/;

  if (!user2 && typeof window !== "undefined") {
    router.push("/login");
  }

  let totalProfit: number = 0;
  let totalLoss: number = 0;
  let totalFoodLoss: number = 0;
  let totalHealthLoss: number = 0;
  let totalFunnyLoss: number = 0;
  let totalEducationLoss: number = 0;
  let totalFixedLoss: number = 0;
  let totalOthersLoss: number = 0;

  transactions &&
    transactions.forEach((transactions) => {
      if (transactions.type === "PROFIT") {
        totalProfit += Number(transactions.amount);
      }

      if (transactions.type === "LOSS") {
        totalLoss += Number(transactions.amount);
      }

      if (transactions.category === "FOOD") {
        totalFoodLoss += Number(transactions.amount);
      }

      if (transactions.category === "HEALTH") {
        totalHealthLoss += Number(transactions.amount);
      }

      if (transactions.category === "FUNNY") {
        totalFunnyLoss += Number(transactions.amount);
      }

      if (transactions.category === "EDUCATION") {
        totalEducationLoss += Number(transactions.amount);
      }

      if (transactions.category === "FIXED") {
        totalFixedLoss += Number(transactions.amount);
      }

      if (transactions.category === "OTHERS") {
        totalOthersLoss += Number(transactions.amount);
      }
    });

  const finalAmount: number = totalLoss + totalProfit;

  const categories = [
    "Alimentação",
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
        data: [
          -totalFoodLoss,
          -totalHealthLoss,
          -totalFunnyLoss,
          -totalEducationLoss,
          -totalFixedLoss,
          -totalOthersLoss,
        ],
        backgroundColor: "rgba(251, 191, 36, 1)", 
        borderColor: "rgba(245, 158, 11, 1)", 
        borderWidth: 4,
      },
    ],
  };

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required("Informe o título da transação")
      .min(3, "O título da transação deve conter no mínimo 3 caracteres."),
    amount: yup
      .string()
      .required("Informe a quantidade transacionada.")
      .nonNullable(),
  });

  async function fetchTransactions() {
    setLoading(true);

    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.transactions);
    } catch (error) {
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as transações. Tente novamente mais tarde.";

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
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
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

    const formattedAmount = amount
      .replace("R$ ", "")
      .replaceAll(".", "")
      .replaceAll(",", ".")

    const numberAmount = Number(formattedAmount);

    if ((!regex.test(numberAmount.toString())) || numberAmount === 0) {
      return toast.warning(
        "Digite um valor válido, positivo e diferente de 0. Ex: R$ 1.000,00",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          },
        }
      );
    }

    const transactionData = {
      title,
      type: selectedType,
      amount: numberAmount,
      category: selectedType === "LOSS" ? selectedCategory : null,
    };

    setLoading(true);

    try {
      await api.post("/transactions", transactionData);
      fetchTransactions();
      setModalRegisterTransactionIsOpen(false);
      reset();
      setSelectedType("PROFIT");
      setSelectedCategory("");
      toast.success("Transação criada com sucesso!", {
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
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar a transação. Tente novamente mais tarde.";

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
    }
  }

  function handleOpenModalRegisterTransaction() {
    setModalRegisterTransactionIsOpen(true);
  }

  function handleCloseModalRegisterTransaction() {
    setModalRegisterTransactionIsOpen(false);
  }

  function verifyCategoryIsEmpty() {
    if (selectedType === "") {
      setCategoryEmpty(true);
    } else {
      setCategoryEmpty(false);
    }
  }

  function DialogRegisterTransaction({ triggerComponent }: any) {
    return (
      <>
        {triggerComponent}
        <Popup
          modal
          nested
          overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
          open={modalRegisterTransactionIsOpen}
          onClose={handleCloseModalRegisterTransaction}
        >
          <div
            className="bg-gray-800 py-8 px-6 flex flex-col rounded-xl"
            style={{
              width:
                width > 768 ? 700 : width > 500 ? 460 : width > 400 ? 380 : 320,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="text-white text-lg font-bold">Nova Transação</p>
              <X
                className="text-red-500 cursor-pointer hover:opacity-70 duration-300 ease-in-out transition-all"
                size={32}
                onClick={handleCloseModalRegisterTransaction}
              />
            </div>
            <div className="w-full flex flex-col gap-8">
              <input
                className="border bg-white border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-amber-400 w-full"
                type="text"
                placeholder="Título"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.title.message}
                </p>
              )}
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value}
                    onChange={field.onChange}
                    decimalScale={2}
                    thousandSeparator="."
                    fixedDecimalScale
                    decimalSeparator=","
                    prefix="R$ "
                    placeholder="R$ 0,00"
                    className="border bg-white border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-amber-400 w-full"
                  />
                )}
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
                  <p className="text-lg font-bold text-white">Gasto</p>
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
                  <p className="text-lg font-bold text-white">Lucro</p>
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
                <option value="FOOD">Alimentação</option>
                <option value="HEALTH">Saúde</option>
                <option value="FUNNY">Lazer</option>
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
                className="py-4 w-40 border rounded-lg border-red-500 ease-in-out duration-300 cursor-pointer hover:bg-red-500 hover:text-white  text-lg font-bold text-red-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit(handleRegisterTransaction)}
                className="py-3 hover:bg-amber-400 rounded-lg hover:text-white w-40 border ease-in-out duration-300 border-amber-400 text-lg font-bold text-amber-400"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Popup>
      </>
    );
  }

  async function handleDeleteTransaction(id: number) {
    setLoading(true);
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
      toast.success("Transação deletada com sucesso!", {
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
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível deletar a transação. Tente novamente mais tarde.";

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

  useEffect(() => {
    setTimeout(() => {
      fetchTransactions();
    }, 1);
  }, []);

  useEffect(() => {
    verifyCategoryIsEmpty();
  }, [selectedCategory]);

  return (
    <>
      {loading || isLoadingUserStorageData ? (
        <div className="min-h-screen overflow-y-auto bg-black flex flex-col items-center justify-center">
          <MainLoading size="sm" />
        </div>
      ) : (
        <>
          <MainHeader chosenPage="Transactions" />
          <div className="md:py-28 py-6 lg:px-40 px-8 items-center justify-center flex-col md:gap-16 gap-8 min-h-screen overflow-y-auto bg-black">
            <div className="flex md:flex-row flex-col items-center md:justify-between md:gap-0 gap-4 mb-12">
              <p className="text-white font-bold text-xl text-center">
                Esse é o resumo de suas transações {user?.name}
              </p>
              <DialogRegisterTransaction
                triggerComponent={
                  <button
                    onClick={handleOpenModalRegisterTransaction}
                    className="rounded-lg bg-amber-400 border-none py-3 px-3 cursor-pointer hover:opacity-70 transition-all ease-in-out duration-300"
                  >
                    <p className="text-white font-extrabold">
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
            <div className="flex items-center justify-center">
            <div className="w-2/3 flex xl:flex-row gap-14 mb-14 flex-col">
              <div className="w-full h-48 flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-xl">
                <p className="text-xl font-bold text-white">
                  Total de gastos
                </p>
                <div className="flex gap-2 items-center">
                  <p
                    className={`text-xl ${
                      totalLoss < 0 ? "text-red-500" : "text-gray-400"
                    } font-extrabold`}
                  >
                    {priceFormatter.format(totalLoss).replace("-", "- ")}
                  </p>
                  {totalLoss < 0 ? (
                    <ArrowCircleDown className="text-red-500" size={24} />
                  ) : (
                    <MinusCircle className="text-gray-400" size={24} />
                  )}
                </div>
              </div>
              <div className="w-full h-48 flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-xl">
                <p className="text-xl font-bold text-white">Balanço geral</p>
                <div className="flex gap-2 items-center">
                  <p
                    className={`text-xl ${
                      finalAmount > 0
                        ? "text-amber-400"
                        : finalAmount === 0
                        ? "text-gray-400"
                        : "text-red-500"
                    }  font-extrabold`}
                  >
                    {priceFormatter.format(finalAmount).replace("-", "- ")}
                  </p>
                  {finalAmount < 0 ? (
                    <ArrowCircleDown className="text-red-500" size={24} />
                  ) : finalAmount === 0 ? (
                    <MinusCircle className="text-gray-400" size={24} />
                  ) : (
                    <ArrowCircleUp className="text-amber-400" size={24} />
                  )}
                </div>
              </div>
              <div className="w-full h-48 flex flex-col items-center justify-center gap-6 bg-gray-800 rounded-xl">
                <p className="text-xl font-bold text-white">
                  Total de ganhos
                </p>
                <div className="flex gap-2 items-center">
                  <p
                    className={`text-xl ${
                      totalProfit > 0 ? "text-amber-400" : "text-gray-400"
                    } font-extrabold`}
                  >
                    {priceFormatter.format(totalProfit)}
                  </p>
                  {totalProfit > 0 ? (
                    <ArrowCircleUp className="text-amber-500" size={24} />
                  ) : (
                    <MinusCircle className="text-gray-400" size={24} />
                  )}
                </div>
              </div>
            </div>
            </div>
            <div className="flex items-center justify-center">
            <div
              className={`
                w-2/3 max-h-96 flex flex-col py-8 bg-gray-900 px-4 rounded-xl
                
              `}
            >
              <div
                className={`overflow-y-auto w-full max-h-96 flex flex-col gap-8 ${
                  transactions.length === 0 && "items-center"
                } ${transactions.length === 0 && "justify-center"}`}
              >
                {transactions && transactions.length > 0 ? (
                  <>
                    {transactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        id={transaction.id}
                        amount={transaction.amount}
                        title={transaction.title}
                        type={transaction.type}
                        category={transaction.category}
                        createdAt={transaction.createdAt}
                        onDelete={() => handleDeleteTransaction(transaction.id)}
                      />
                    ))}
                  </>
                ) : (
                  <p className="xl:text-xl text-lg text-center text-white font-bold">
                    {" "}
                    Voce ainda não tem nenhuma transação. Que tal cadastrar uma?
                  </p>
                )}
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
