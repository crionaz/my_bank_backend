import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getRefreshToken(): string;
  incLoginAttempts(): Promise<IUser>;
  resetLoginAttempts(): Promise<IUser>;
  isLocked: boolean;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please add a valid phone number'],
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'US' },
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value < new Date();
      },
      message: 'Date of birth must be in the past',
    },
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc: any, ret: any) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
  },
});

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for isLocked
userSchema.virtual('isLocked').get(function(this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(this: IUser, next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function(this: IUser & { _id: any }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(
    { id: this._id.toString() },
    secret as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRE || '15m' } as jwt.SignOptions
  );
};

// Generate refresh token
userSchema.methods.getRefreshToken = function(this: IUser & { _id: any }): string {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  
  return jwt.sign(
    { id: this._id.toString() },
    refreshSecret as jwt.Secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' } as jwt.SignOptions
  );
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function(this: IUser): Promise<any> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $set: {
        loginAttempts: 1,
      },
      $unset: {
        lockUntil: 1,
      },
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };

  // Lock account for 2 hours after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) }; // 2 hours
  }

  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function(this: IUser): Promise<any> {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1,
    },
  });
};

export const User = mongoose.model<IUser>('User', userSchema);
