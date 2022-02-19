import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";

const config: Config.InitialOptions = {
  verbose: true,
  rootDir: ".",
  testMatch: ["**/__tests__/unit/**/*.test.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleNameMapper: pathsToModuleNameMapper({
    "@rules/*": [__dirname + "/src/server/rules/*"],
  }),
};

export default config;
