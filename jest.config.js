module.exports = {
    transformIgnorePatterns: [
      '/node_modules/(?!axios|react-router-dom).+\\.js$'
    ],
    moduleNameMapper: {
      '^axios$': '<rootDir>/node_modules/axios/dist/axios.js'
    },
    testEnvironment: 'jsdom'
  };
  