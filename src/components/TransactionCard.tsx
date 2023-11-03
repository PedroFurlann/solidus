import { TransactionDTO } from "@/dtos/TransactionDTO";
import useWindowSize from "@/hooks/useWindowsSize";
import { priceFormatter } from "@/utils/priceFormatter";
import dayjs, { Dayjs } from "dayjs";
import { ArrowDown, ArrowUp, Trash, X } from "phosphor-react";
import { ReactNode, useState } from "react";
import Popup from "reactjs-popup";

interface Props {
  id: number;
  title: string;
  amount: number;
  type: string;
  createdAt: Dayjs;
  category?: string;
  onDelete: (id: number) => void;
}

export function TransactionCard({
  id,
  title,
  amount,
  type,
  category,
  createdAt,
  onDelete,
}: Props) {
  const [modalDeleteTransactionIsOpen, setModalDeleteTransactionIsOpen] =
    useState(false);

  const { width } = useWindowSize();

  function handleOpenModalDeleteTransaction() {
    setModalDeleteTransactionIsOpen(true);
  }

  function handleCloseModalDeleteTransaction() {
    setModalDeleteTransactionIsOpen(false);
  }

  function DialogDeleteTransaction({ title, createdAt, id }: TransactionDTO) {
    return (
      <>
        <Popup
          modal
          nested
          overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
          open={modalDeleteTransactionIsOpen}
          onClose={handleCloseModalDeleteTransaction}
        >
          <div
            className="bg-gray-800 py-8 px-6 flex flex-col rounded-xl"
            style={{
              width:
                width > 768 ? 700 : width > 500 ? 460 : width > 400 ? 380 : 320,
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="text-white text-xl font-bold">
                Excluir transação
              </p>
              <X
                className="text-red-500 cursor-pointer hover:opacity-70 duration-300 ease-in-out transition-all"
                size={32}
                onClick={handleCloseModalDeleteTransaction}
              />
            </div>
            <p className="text-white text-lg font-bold mb-10">
              Tem certeza que deseja remover a transação {title}, criada em{" "}
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}? Essa ação não
              poderá ser revertida.
            </p>
            <div className="flex items-center justify-end gap-8">
              <button
                onClick={handleCloseModalDeleteTransaction}
                className="py-3 w-40 border rounded-lg border-red-500 ease-in-out duration-300 cursor-pointer hover:bg-red-500 hover:text-white  text-lg font-bold text-red-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(id);
                  handleCloseModalDeleteTransaction();
                }}
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

  return (
    <div
      className={`w-[calc(100% - 20px)] mr-4 bg-gray-800 px-4 py-4 xl:flex-row flex-col md:gap-0 gap-2 flex items-center sm:justify-between justify-center rounded-lg`}
    >
      <div className="flex sm:gap-3 gap-2">
        <p className="text-md font-extrabold text-white text-center">
          {title.charAt(0).toUpperCase() + title.slice(1)}
          {type === "LOSS"
            ? category === "FOOD"
              ? ": Alimentação"
              : category === "EDUCATION"
              ? ": Educação"
              : category === "FUNNY"
              ? ": Lazer"
              : category === "HEALTH"
              ? ": Saúde"
              : category === "FIXED"
              ? ": Gastos Fixos"
              : ": Outros"
            : ""}
        </p>
        {width > 1280 && (
          <div className="flex gap-1">
            <p
              className={`text-md font-extrabold ${
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
        )}
      </div>
      {width < 1280 && (
        <div className="flex gap-1">
          <p
            className={`text-md font-extrabold ${
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
      )}
      <div className="flex gap-2 items-center">
        <p className="text-white text-md font-extrabold">
          {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
        </p>
        <Trash
          className="text-red-500 cursor-pointer hover:opacity-70 duration-300 transition-all ease-in-out"
          size={20}
          weight="fill"
          onClick={handleOpenModalDeleteTransaction}
        />

        <DialogDeleteTransaction
          id={id}
          createdAt={createdAt}
          category={category}
          amount={amount}
          title={title}
          type={type}
        />
      </div>
    </div>
  );
}
