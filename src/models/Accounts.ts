import { generateAccountNumber } from '@/utils/helpers';
import mongoose, { Document, model, Schema } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  accountNumber: string;
  type: 'current' | 'savings';
  balance: number;
  status: 'active' | 'frozen' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;

  freeze(): Promise<IAccount>;
  close(): Promise<IAccount>;
  activate(): Promise<IAccount>;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
    },

    accountNumber: {
      type: String,
      required: [true, 'Account number is required.'],
      match: [/^\d{10}$/, 'Account number must be exactly 10 digits.'],
      unique: true,
    },

    type: {
      type: String,
      enum: {
        values: ['current', 'savings'],
        message: 'Account type must be either "current" or "savings".',
      },
      required: [true, 'Account type is required.'],
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required.'],
      min: [0, 'Balance cannot be negative.'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'frozen', 'closed'],
        message: 'Status must be either "active", "frozen", or "closed".',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ userId: 1 });
accountSchema.index({ accountNumber: 1 }, { unique: true });

accountSchema.methods.freeze = function () {
  this.status = 'frozen';
  return this.save();
};

accountSchema.methods.close = function () {
  this.status = 'closed';
  return this.save();
};

accountSchema.methods.activate = function () {
  this.status = 'active';
  return this.save();
};

accountSchema.pre<IAccount>('validate', function (next) {
  if (!this.accountNumber) {
    const randomNumber = generateAccountNumber();
    this.accountNumber = randomNumber;
  }
  next();
});

export default model<IAccount>('Accounts', accountSchema);
