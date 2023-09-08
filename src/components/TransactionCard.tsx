import useWindowSize from "@/hooks/useWindowsSize";
import { priceFormatter } from "@/utils/priceFormatter";
import { ArrowDown, ArrowUp, Trash } from "phosphor-react";

interface Props {
  id: string;
  title: string;
  amount: number;
  type: "PROFIT" | "LOSS";
  category: "FOOD" | "EDUCATION" | "FUN" | "HEALTH" | "FIXED" | "OTHERS";
}

export function TransactionCard({ id, title, amount, type, category }: Props) {

  return (
    <div className={`w-full bg-gray-800 px-8 py-4 sm:flex-row flex-col sm:gap-0 gap-4 flex items-center sm:justify-between justify-center rounded-lg`}>
      <div className="flex sm:gap-6 gap-4">
        <p className="text-lg font-extrabold text-gray-200">
          {title}: 
          {category === "FOOD"
            ? " Comida"
            : category === "EDUCATION"
            ? " Educação"
            : category === "FUN"
            ? " Lazer"
            : category === "HEALTH"
            ? " Saúde"
            : category === "FIXED"
            ? " Gastos Fixos"
            : " Outros"}
        </p>
        <div className="flex gap-1">
          <p
            className={`text-lg font-extrabold ${
              type === "PROFIT" ? "text-amber-500" : "text-red-500"
            }`}
          >
            {priceFormatter.format(amount)}
          </p>
          {type === "PROFIT" ? (
            <ArrowUp className="text-amber-400" weight="bold" size={24} />
          ) : (
            <ArrowDown className="text-red-500" weight="bold" size={24} />
          )}
        </div>
      </div>
      <div className="flex gap-6 items-center">
        <p className="text-gray-200 text-lg font-extrabold">22/07/2023</p>
        <Trash
          className="text-red-500 cursor-pointer hover:opacity-70 duration-300 transition-all ease-in-out"
          size={24}
          weight="fill"
        />
      </div>
    </div>
  );
}
