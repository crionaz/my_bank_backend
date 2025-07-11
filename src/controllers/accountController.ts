import { Request, Response } from 'express';
import Accounts from '@/models/Accounts';

interface Params {
  id: string;
}

export const getAllAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accounts = await Accounts.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error });
  }
};

export const getAccountById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const account = await Accounts.findById(id);
    if (!account) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account', error });
  }
};

export const updateAccountById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedAccount = await Accounts.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAccount) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(400).json({ message: 'Error updating account', error });
  }
};
