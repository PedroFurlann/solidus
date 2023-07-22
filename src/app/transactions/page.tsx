"use client"
import { MainHeader } from "@/components/MainHeader";
import { TransactionCard } from "@/components/TransactionCard";
import { ArrowDown, ArrowUp } from "phosphor-react";

export default function Transactions() {
  return (
    <>
      <MainHeader />
      <div className="md:py-28 py-6 md:px-40 items-center justify-center flex-col md:gap-16 gap-8 min-h-screen overflow-auto bg-gray-950">
        <div className="w-full flex gap-14 mb-8">
          <div className="w-full h-48 flex flex-col justify-center items-center gap-6 bg-gray-800 rounded-xl">
            <p className="text-xl font-bold text-gray-200">Total de gastos</p>
            <div className="flex gap-2 items-center">
              <p className="text-3xl text-red-500 font-extrabold">
                - R$ 2850,54
              </p>
              <ArrowDown className="text-red-500" size={36} />
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-6 bg-gray-900 rounded-xl">
            <p className="text-xl font-bold text-gray-200">Balanço Geral</p>
            <p className="text-3xl text-red-500 font-extrabold">R$ 2850,54</p>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-6 bg-gray-800 rounded-xl">
            <p className="text-xl font-bold text-gray-200">Total recebido</p>
            <div className="flex gap-2 items-center">
              <p className="text-3xl text-amber-400 font-extrabold">
                R$ 2000,54
              </p>
              <ArrowUp className="text-amber-500" size={36} />
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-col md:py-8 overflow-auto bg-gray-900 md:px-8 gap-8 rounded-xl">
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
