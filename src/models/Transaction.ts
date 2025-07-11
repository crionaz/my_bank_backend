import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  fromAccount: mongoose.Types.ObjectId;
  toAccount: mongoose.Types.ObjectId;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal';
  status?: 'success' | 'failed';
  timestamp: Date;
  description?: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Source account is required'],
    },
    toAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Destination account is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: ['transfer', 'deposit', 'withdrawal'],
      required: [true, 'Transaction type is required'],
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  transactionSchema
);
