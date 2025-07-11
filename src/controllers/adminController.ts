import Accounts from '@/models/Accounts';
import { Request, Response } from 'express';

export const updateAccountStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.query; // expects 'activate', 'freeze', or 'close'

    const account = await Accounts.findById(id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (action === 'freeze') {
      await account.freeze();
    } else if (action === 'close') {
      await account.close();
    } else if (action === 'activate') {
      await account.activate();
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    return res
      .status(200)
      .json({ message: `Account ${action}d successfully`, account });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

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
