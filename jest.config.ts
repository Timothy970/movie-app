import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            { tsconfig: "tsconfig.jest.json" }
        ],
    },
    moduleNameMapper: {
        "^@/app/(.*)$": "<rootDir>/src/app/$1",
        "^@/components/(.*)$": "<rootDir>/src/components/$1",
        "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
        "^@/context/(.*)$": "<rootDir>/src/context/$1",
        "^@/services/(.*)$": "<rootDir>/src/services/$1",

        // mock firebase
        "^firebase/app$": "<rootDir>/src/__mocks__/firebase/app.ts",
        "^firebase/auth$": "<rootDir>/src/__mocks__/firebase/auth.ts",
        "^firebase/firestore$": "<rootDir>/src/__mocks__/firebase/firestore.ts",

        "^@supabase/supabase-js$": "<rootDir>/src/__mocks__/supabase.ts",
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
