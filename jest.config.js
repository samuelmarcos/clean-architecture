
module.exports =  {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir/src/**/*.ts>',
    '<rootDir/src/main/**',
    '<rootDir/src/mocks/**'],
  coverageDirectory: "coverage",
  // coverageProvider: "v8",
  roots: [
    "<rootDir>/src"
  ],
  testEnvironment: "node",
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@/(.*)': '<rootDir/src$1'
  }
};
