import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { Transaction } from '../models/Transaction';
import Accounts from '@/models/Accounts';
import { sendResponse } from '@/utils/response';

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fromAccount, toAccount, amount, type, status, description } =
    req.body;

  try {
    // Validate account existence
    const source = await Accounts.findById(fromAccount);
    const destination = await Accounts.findById(toAccount);

    if (!source || !destination) {
      sendResponse(res, 404, {
        status: false,
        message: 'One or both accounts not found',
      });
      return;
    }

    // Check balance for transfer or withdrawal
    if (
      (type === 'transfer' || type === 'withdrawal') &&
      source.balance < amount
    ) {
      sendResponse(res, 400, {
        status: false,
        message: 'Insufficient balance',
      });
      return;
    }

    // Update balances
    if (type === 'transfer') {
      source.balance -= amount;
      destination.balance += amount;
    } else if (type === 'deposit') {
      destination.balance += amount;
    } else if (type === 'withdrawal') {
      source.balance -= amount;
    }

    await source.save();
    await destination.save();

    // Create transaction
    const transaction = new Transaction({
      fromAccount,
      toAccount,
      amount,
      type,
      status: status || 'success',
      description,
    });

    const savedTransaction = await transaction.save();
    sendResponse(res, 201, {
      status: true,
      message: 'Transaction Successfully Done',
      data: savedTransaction,
    });
  } catch (error) {
    sendResponse(res, 500, {
      status: false,
      message: 'Internal server error',
      errors: [{ error: 'Internal server error' }],
    });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const userId = req.query.userId as string;

    const query: any = {};

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const userAccounts = await Accounts.find({ userId }).select('_id');
      const accountIds = userAccounts.map(acc => acc._id);

      query.$or = [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } },
      ];
    }

    const transactions = await Transaction.find(query)
      .populate('fromAccount toAccount', 'accountNumber balance type')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);
    sendResponse(res, 200, {
      status: true,
      message: 'Transaction fetch successfully',
      data: transactions,
      page: page,
      limit: limit,
      count: total,
    });
  } catch (error) {
    sendResponse(res, 500, {
      status: false,
      message: 'Internal server error',
      errors: [{ error: 'Internal server error' }],
    });
  }
};
