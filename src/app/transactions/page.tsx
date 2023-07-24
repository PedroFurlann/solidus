"use client";
import { MainHeader } from "@/components/MainHeader";
import { TransactionCard } from "@/components/TransactionCard";
import useWindowSize from "@/hooks/useWindowsSize";
import { priceFormatter } from "@/utils/priceFormatter";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowDown, ArrowUp, X } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BottomSheet } from "react-spring-bottom-sheet";
import Popup from "reactjs-popup";
import * as yup from "yup";

interface FormData {
  description: string;
  amount: number;
}

export default function Transactions() {
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isMobile } = useWindowSize();

  const validationSchema = yup.object().shape({
    description: yup
      .string()
      .required("A descrição da transação é obrigatória")
      .email("Digite um e-mail válido"),
    amount: yup.number().required("Informe um valor válido!").min(1),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  function handleRegisterTransaction({ description, amount }: FormData) {
    console.log("Description => ", description, "Amount => ", amount);
  }

  function handleOpenModal() {
    if (isMobile) {
      setBottomSheetIsOpen(true);
    } else {
      setModalIsOpen(true);
    }
  }

  function handleCloseModal() {
    if (isMobile) {
      setBottomSheetIsOpen(false);
    } else {
      setModalIsOpen(false);
    }
  }

  function DialogAndBottomSheet({ triggerComponent }: any) {
    return !isMobile ? (
      <>
        {triggerComponent}
        <Popup
          modal
          nested
          overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
          open={modalIsOpen}
        >
          <div
            className="bg-gray-800 py-8 px-6 flex flex-col rounded-xl"
            style={{ width: 700, height: 500 }}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-200 text-lg font-bold">Nova Transação</p>
              <X
                className="text-red-500 cursor-pointer hover:opacity-70 duration-300 ease-in-out transition-all"
                size={32}
                onClick={handleCloseModal}
              />
            </div>
            <div className="w-full flex flex-col gap-8">
              <input
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-gray-700 focus:ring-amber-400 w-full"
                type="text"
                placeholder="Descrição da transação"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </Popup>
      </>
    ) : (
      <>
        {triggerComponent}
        <BottomSheet
          open={bottomSheetIsOpen}
          onDismiss={() => setBottomSheetIsOpen(false)}
          snapPoints={({ minHeight, maxHeight }) => [
            minHeight + 70,
            maxHeight * 0.7,
          ]}
          header={<h1 style={{ textAlign: "center" }}>Header</h1>}
        >
          <div className="bg-slate-800">
            <p>ola</p>
          </div>
        </BottomSheet>
      </>
    );
  }

  return (
    <>
      <MainHeader chosenPage="Transactions" />
      <div className="md:py-28 py-6 md:px-40 px-8 items-center justify-center flex-col md:gap-16 gap-8 min-h-screen overflow-auto bg-gray-950">
        <div className="flex md:flex-row flex-col items-center md:justify-between md:gap-0 gap-4 mb-8">
          <p className="text-gray-200 font-bold text-2xl text-center">
            Essas é o resumo de suas transações Pedro
          </p>
          <DialogAndBottomSheet
            triggerComponent={
              <button
                onClick={handleOpenModal}
                className="rounded-lg bg-amber-400 border-none py-4 px-4 cursor-pointer hover:opacity-70 transition-all ease-in-out duration-300"
              >
                <p className="text-gray-50 font-extrabold">Nova Transação</p>
              </button>
            }
          />
        </div>
        <div className="w-full flex lg:flex-row gap-14 mb-8 flex-col">
          <div className="w-full h-48 flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-xl">
            <p className="text-xl font-bold text-gray-200">Total de gastos</p>
            <div className="flex gap-1 items-center">
              <p className="text-2xl text-red-500 font-extrabold">
                - {priceFormatter.format(2850.54)}
              </p>
              <ArrowDown className="text-red-500" size={36} />
            </div>
          </div>
          <div className="w-full h-48 flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-xl">
            <p className="text-xl font-bold text-gray-200">Balanço final</p>
            <div className="flex gap-1 items-center">
              <p className="text-2xl text-red-500 font-extrabold">
                - {priceFormatter.format(8002.54)}
              </p>
              <ArrowDown className="text-red-500" size={36} />
            </div>
          </div>
          <div className="w-full h-48 flex flex-col items-center justify-center gap-6 bg-gray-800 rounded-xl">
            <p className="text-xl font-bold text-gray-200">Total recebido</p>
            <div className="flex gap-1 items-center">
              <p className="text-2xl text-amber-400 font-extrabold">
                {priceFormatter.format(2000.54)}
              </p>
              <ArrowUp className="text-amber-500" size={36} />
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-col py-8 overflow-auto bg-gray-900 md:px-8 px-4 gap-8 rounded-xl">
          <TransactionCard amount={1000} id="1" title="Teste" type="PROFIT" />
          <TransactionCard amount={213} id="1" title="Teste" type="LOSS" />
          <TransactionCard amount={10300} id="1" title="Teste" type="PROFIT" />
          <TransactionCard amount={20202} id="1" title="Teste" type="LOSS" />
          <TransactionCard amount={4000} id="1" title="Teste" type="PROFIT" />
          <TransactionCard amount={20000} id="1" title="Teste" type="LOSS" />
          <TransactionCard amount={1000} id="1" title="Teste" type="PROFIT" />
          <TransactionCard amount={1000} id="1" title="Teste" type="PROFIT" />
          <TransactionCard amount={1000} id="1" title="Teste" type="PROFIT" />
          <TransactionCard amount={1000} id="1" title="Teste" type="PROFIT" />
        </div>
      </div>
    </>
  );
}
