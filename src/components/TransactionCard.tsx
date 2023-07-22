import { ArrowDown, ArrowUp } from "phosphor-react";

interface Props {
  id: string;
  title: string;
  amount: number;
  type: "PROFIT" | "LOSS";
}

export function TransactionCard({ id, title, amount, type }: Props) {
  return (
    <div className="w-full h-14 bg-gray-800 px-4 py-4 flex items-center justify-around gap-8 rounded-lg">
      <p className="text-lg font-extrabold text-gray-200">{title}</p>
      <div className="flex gap-1">
        <p
          className={`text-lg font-extrabold ${
            type === "PROFIT" ? "text-amber-500" : "text-red-500"
          }`}
        >
          R$ {String(amount.toFixed(2).replace(".", ","))}
        </p>
        {type === "PROFIT" ? (
          <ArrowUp className="text-amber-400" weight="bold" size={24} />
        ) : (
          <ArrowDown className="text-red-500" weight="bold" size={24} />
        )}
      </div>
    </div>
  );
}
