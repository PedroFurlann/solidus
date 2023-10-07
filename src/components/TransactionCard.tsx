import useWindowSize from "@/hooks/useWindowsSize";
import { priceFormatter } from "@/utils/priceFormatter";
import dayjs, { Dayjs } from "dayjs";
import { ArrowDown, ArrowUp, Trash } from "phosphor-react";

interface Props {
  id: number;
  title: string;
  amount: number;
  type: string;
  createdAt: Dayjs;
  category?: string;
  openModalDelete: () => void
}

export function TransactionCard({ id, title, amount, type, category, createdAt, openModalDelete }: Props) {

  return (
    <div className={`w-full bg-gray-800 px-8 py-4 sm:flex-row flex-col sm:gap-0 gap-4 flex items-center sm:justify-between justify-center rounded-lg`}>
      <div className="flex sm:gap-6 gap-4">
        <p className="text-lg font-extrabold text-gray-200">
          {title} 
          {
            type === "LOSS" ?  category === "FOOD"
            ? ": Comida"
            : category === "EDUCATION"
            ? ": Educação"
            : category === "FUN"
            ? ": Lazer"
            : category === "HEALTH"
            ? ": Saúde"
            : category === "FIXED"
            ? ": Gastos Fixos"
            : ": Outros" : ""}
           
        </p>
        <div className="flex gap-1">
          <p
            className={`text-lg font-extrabold ${
              type === "PROFIT" ? "text-amber-500" : "text-red-500"
            }`}
          >
            {priceFormatter.format(amount).replace("-", "- ")}
          </p>
          {type === "PROFIT" ? (
            <ArrowUp className="text-amber-400" weight="bold" size={24} />
          ) : (
            <ArrowDown className="text-red-500" weight="bold" size={24} />
          )}
        </div>
      </div>
      <div className="flex gap-6 items-center">
        <p className="text-gray-200 text-lg font-extrabold">{dayjs(createdAt).format("DD/MM/YYYY HH:mm")}</p>
        <Trash
          className="text-red-500 cursor-pointer hover:opacity-70 duration-300 transition-all ease-in-out"
          size={24}
          weight="fill"
          onClick={openModalDelete}
        />
      </div>
    </div>
  );
}
