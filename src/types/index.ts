export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface LoginAttempt {
  ip: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
}

export interface BankingError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Account related types
export interface IAccount {
  _id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'credit';
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction related types
export interface ITransaction {
  _id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'user' | 'admin';
export type AccountType = 'checking' | 'savings' | 'credit';
export type TransactionType = 'transfer' | 'deposit' | 'withdrawal';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
