import { Types } from 'mongoose';

export interface ITransactionInput {
  fromAccount: Types.ObjectId;
  toAccount: Types.ObjectId;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal';
  status?: 'success' | 'failed';
  description?: string;
}
