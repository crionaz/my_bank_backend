import { body } from 'express-validator';
import mongoose from 'mongoose';

export const validateTransaction = [
  body('fromAccount')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid fromAccount ObjectId'),
  body('toAccount')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid toAccount ObjectId'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .isIn(['transfer', 'deposit', 'withdrawal'])
    .withMessage('Invalid transaction type'),
  body('status').optional().isIn(['success', 'failed']),
  body('description').optional().isString(),
];
