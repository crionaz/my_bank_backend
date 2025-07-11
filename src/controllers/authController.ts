import { Request, Response, NextFunction } from 'express';
import { User } from '@models/User';
import { logger } from '@utils/logger';
import jwt from 'jsonwebtoken';
import Accounts from '@/models/Accounts';

// @desc    Create account (same as register)
// @route   POST /api/v1/auth/create-account
// @access  Public
export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone, address, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
      return;
    }

    // Create user with default role and status
    const user = await User.create({
      name,
      email,
      password,
      role: 'user', // Default to user role
      status: 'active', // Default to active status
      phone,
      address,
      dateOfBirth,
    });

    logger.info(`New account created: ${user.email}`);

    // Create token
    const token = user.getSignedJwtToken();
    const refreshTokenValue = user.getRefreshToken();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token,
        refreshToken: refreshTokenValue,
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    logger.error('Create account error:', error);
    next(error);
  }
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, status, phone, address, dateOfBirth } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      status,
      phone,
      address,
      dateOfBirth,
    });

    logger.info(`New user registered: ${user.email}`);

    // Automatically create a new account for the user
    const account = await Accounts.create({
      userId: user._id,
      type: 'savings', // or 'current' based on your logic
      balance: 0, // default balance
    });

    logger.info(
      `Account created for user ${user.email}: ${account.accountNumber}`
    );

    // Create token
    const token = user.getSignedJwtToken();
    const refreshTokenValue = user.getRefreshToken();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        account: {
          id: account._id,
          number: account.accountNumber,
          type: account.type,
          balance: account.balance,
          status: account.status,
        },
        token,
        refreshToken: refreshTokenValue,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide an email and password',
      });
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Check if account is locked
    if (user.isLocked) {
      res.status(423).json({
        success: false,
        error:
          'Account is temporarily locked due to too many failed login attempts',
      });
      return;
    }

    // Check if account is active
    if (user.status !== 'active') {
      res.status(401).json({
        success: false,
        error: 'Account has been deactivated',
      });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();

      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    // Create token
    const token = user.getSignedJwtToken();
    const refreshTokenValue = user.getRefreshToken();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken: refreshTokenValue,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: 'Refresh token is required',
      });
      return;
    }

    // Verify refresh token
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
      return;
    }

    const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);

    if (!user || user.status !== 'active') {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
      return;
    }

    // Generate new tokens
    const newToken = user.getSignedJwtToken();
    const newRefreshToken = user.getRefreshToken();

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
};
