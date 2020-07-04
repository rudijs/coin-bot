module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/fixtures/**/*"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // "./src/sigV4Client.ts": {
    // branches: 62,
    // },
  },
  coverageReporters: ["json", "lcov", "text", "clover"],
  testTimeout: 10000,
}
