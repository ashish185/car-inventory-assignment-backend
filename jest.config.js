/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/modules/vehicle-make/run-ingestion.ts'],
  coverageDirectory: '<rootDir>/coverage',
  clearMocks: true,
};
