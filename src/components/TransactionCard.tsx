interface Props {
  id: string
  title: string
  amount: number
  type: "PROFIT" | "LOSS";
}

export function TransactionCard({ id, title, amount, type }: Props) {
  return (
    <div className="w-full h-14 bg-gray-600">
      <p className="">{title}</p>
      <p className={`text-lg font-bold ${type === "PROFIT" ? "text-green-500" : "text-red-500"}`}>{amount}</p>
    </div>
  )
}