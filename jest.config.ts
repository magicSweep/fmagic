import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  //verbose: true,

  testEnvironment: "jest-environment-node", //js-dom
  //testEnvironment: "jest-environment-jsdom",

  moduleNameMapper: {
    /*  "\\.(css)$": "<rootDir>/node_modules/identity-obj-proxy",
    "^.+\\.module\\.(css|sass|scss)$":
      "<rootDir>/node_modules/identity-obj-proxy", */
    "^lodash-es(.*)$": "<rootDir>/node_modules/lodash",
  },

  roots: ["<rootDir>/src"],

  //testMatch: ["<rootDir>/src/**/*.test.(js|jsx|ts|tsx)$)"],

  transform: {
    //"^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.[t|j]sx?$": "ts-jest",
    //"^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest",
    //"^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/jest/fileTransform.js",
  },

  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  //setupFiles: ["<rootDir>/jest/globalMock.js"],
};
export default config;
