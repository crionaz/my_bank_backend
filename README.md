# Banking Web Application Backend

## 🚀 Professional Node.js TypeScript Template

A comprehensive, production-ready Node.js backend template built with TypeScript, featuring enterprise-level security, authentication, logging, and development tools.

## ✨ Features

### 🔒 Security
- **JWT Authentication** with refresh tokens
- **Password hashing** using bcrypt with configurable rounds
- **Rate limiting** and request throttling
- **Input validation** and sanitization
- **CORS** configuration
- **Helmet** for security headers
- **Account locking** after failed login attempts

### 🛠️ Development Tools
- **TypeScript** with strict configuration
- **ESLint** and **Prettier** for code quality
- **Husky** git hooks for pre-commit checks
- **Jest** testing framework with coverage
- **Nodemon** for development hot reload
- **Path mapping** for clean imports

### 📊 Logging & Monitoring
- **Morgan** HTTP request logging with colored output in development
- **Console logger** with timestamps and log levels (INFO, ERROR, WARN, DEBUG)
- **Error handling** middleware
- **Health check** endpoint

### 🗄️ Database
- **MongoDB** with Mongoose ODM
- **Connection management** with reconnection logic
- **Test database** configuration

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts  # MongoDB connection
│   ├── cors.ts      # CORS configuration
│   ├── rateLimit.ts # Rate limiting setup
│   └── slowDown.ts  # Request throttling
├── controllers/     # Route controllers
│   └── authController.ts
├── middleware/      # Custom middleware
│   ├── auth.ts      # Authentication middleware
│   ├── errorHandler.ts
│   ├── notFound.ts
│   └── validation.ts
├── models/          # Database models
│   └── User.ts
├── routes/          # API routes
│   ├── auth.ts
│   ├── user.ts
│   ├── account.ts
│   └── transaction.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   ├── logger.ts
│   └── helpers.ts
├── __tests__/       # Test files
│   ├── setup.ts
│   └── auth.test.ts
└── server.ts        # Main application file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd my_bank_backend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

4. **Development**
```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

5. **Production**
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📋 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/my_bank_dev

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `GET /api/v1/auth/me` - Get current user

### Health Check
- `GET /health` - Application health status

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🛡️ Security Features

### Authentication & Authorization
- JWT tokens with configurable expiration
- Refresh token rotation
- Role-based access control
- Account lockout after failed attempts

### Input Validation
- Request body validation using express-validator
- SQL injection prevention
- XSS protection
- Parameter pollution prevention

### Rate Limiting
- IP-based rate limiting
- Configurable request limits
- Gradual slowdown for suspicious activity

## 📝 Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint with TypeScript rules
- Prettier for consistent formatting
- Pre-commit hooks for code quality

### Error Handling
- Centralized error handling middleware
- Custom error types
- Comprehensive logging
- Graceful shutdown handling

### Database Best Practices
- Mongoose schema validation
- Indexes for performance
- Connection pooling
- Transaction support ready

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

## 📊 Monitoring & Logging

### Simple Console Logger
- Multiple log levels (error, warn, info, debug)
- Timestamp formatting
- Environment-aware logging
- Development vs production modes

### Morgan HTTP Logging
- Request/response logging
- Development-friendly colored output
- Performance metrics (response time, status codes)
- Automatic request tracking

## 🔧 Customization

This template is designed to be easily customizable:

1. **Add new routes** in the `routes/` directory
2. **Create models** in the `models/` directory
3. **Add middleware** in the `middleware/` directory
4. **Extend validation** in `middleware/validation.ts`
5. **Configure security** in the `config/` directory

## 📚 Banking Application Use Cases

### Core Features
1. **User Authentication** - Secure login/registration
2. **Account Management** - View balances and account details
3. **Fund Transfers** - Transfer money between accounts
4. **Transaction History** - View and filter transactions
5. **Admin Controls** - Account management and monitoring

### Business Logic
- Transaction validation and processing
- Balance calculations and updates
- Audit trails for compliance
- Real-time notifications
- Multi-factor authentication ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for secure and scalable banking applications** 

 