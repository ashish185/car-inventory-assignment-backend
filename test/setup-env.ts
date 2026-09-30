process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/car-inventory-test';
process.env.NHTSA_BASE_URL = process.env.NHTSA_BASE_URL ?? 'https://vpic.nhtsa.dot.gov/api/vehicles';
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'silent';
