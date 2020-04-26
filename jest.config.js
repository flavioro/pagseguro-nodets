module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    __TEST__: true
  },
  rootDir: '.',
  setupFilesAfterEnv: ['./jest.setup.js']
};
