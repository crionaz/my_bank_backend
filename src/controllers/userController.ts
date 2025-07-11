import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '@models/User';
import { logger } from '@utils/logger';
import { calculatePagination } from '@utils/helpers';

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user._id;
    const { name, phone, address, dateOfBirth } = req.body;

    // Build update object with only provided fields
    const updateFields: Partial<IUser> = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = new Date(dateOfBirth);

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    logger.error('Update user profile error:', error);
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const role = req.query.role as string;
    const search = req.query.search as string;

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Calculate pagination
    const pagination = calculatePagination(page, limit, total);

    // Fetch users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(pagination.offset)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination,
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

// @desc    Freeze user account (Admin only)
// @route   PUT /api/v1/admin/users/:id/freeze
// @access  Private/Admin
export const freezeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 'frozen' },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    logger.info(`User account frozen by admin: ${user.email} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User account has been frozen successfully',
    });
  } catch (error) {
    logger.error('Freeze user error:', error);
    next(error);
  }
};

// @desc    Unfreeze user account (Admin only)
// @route   PUT /api/v1/admin/users/:id/unfreeze
// @access  Private/Admin
export const unfreezeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    logger.info(`User account unfrozen by admin: ${user.email} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: user,
      message: 'User account has been unfrozen successfully',
    });
  } catch (error) {
    logger.error('Unfreeze user error:', error);
    next(error);
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    next(error);
  }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['active', 'inactive', 'suspended', 'frozen'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: active, inactive, suspended, frozen',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    logger.info(`User status updated by admin: ${user.email} status changed to ${status} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: user,
      message: `User status has been updated to ${status} successfully`,
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    next(error);
  }
};
