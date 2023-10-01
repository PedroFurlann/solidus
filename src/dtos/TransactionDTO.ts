import { Dayjs } from "dayjs";

export interface TransactionDTO {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: Dayjs;
}