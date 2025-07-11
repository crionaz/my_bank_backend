import { body } from 'express-validator';
import mongoose from 'mongoose';

export const validateTransaction = [
  body('fromAccount')
    .isString()
    .matches(/^[0-9]{10,20}$/)
    .withMessage('Invalid destination account number'),
  body('toAccount')
    .isString()
    .matches(/^[0-9]{10,20}$/)
    .withMessage('Invalid destination account number'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .isIn(['transfer', 'deposit', 'withdrawal'])
    .withMessage('Invalid transaction type'),
  body('status').optional().isIn(['success', 'failed']),
  body('description').optional().isString(),
];
