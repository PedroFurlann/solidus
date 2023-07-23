"use client"
import { MainHeader } from "@/components/MainHeader";
import { TransactionCard } from "@/components/TransactionCard";
import { priceFormatter } from "@/utils/priceFormatter";
import { ArrowDown, ArrowUp } from "phosphor-react";

export default function Transactions() {
  return (
    <>
      <MainHeader chosenPage="Transactions" />
      <div className="md:py-28 py-6 md:px-40 px-8 items-center justify-center flex-col md:gap-16 gap-8 min-h-screen overflow-auto bg-gray-950">
        <div className="flex md:flex-row flex-col items-center md:justify-between md:gap-0 gap-4 mb-8">
          <p className="text-gray-200 font-bold text-2xl text-center">Essas é o resumo de suas transações Pedro</p>
          <button className="rounded-lg bg-amber-400 border-none py-4 px-4 cursor-pointer hover:opacity-70 transition-all ease-in-out duration-300">
            <p className="text-gray-50 font-extrabold">Nova Transação</p>
          </button>
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
