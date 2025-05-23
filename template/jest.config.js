module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', 'dist'],
  modulePathIgnorePatterns: ['dist'],
  setupFiles: ['./jest.setup.env.js'],
  testTimeout: 60000,
  verbose: true,
};
