import { connectDB, disconnectDB } from '@config/database';

// Setup test database connection
beforeAll(async () => {
  // Use test database
  process.env.MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/my_bank_test';
  await connectDB();
});

// Cleanup after tests
afterAll(async () => {
  await disconnectDB();
});

// Clear database before each test
beforeEach(async () => {
  // You can add database cleanup logic here if needed
});
