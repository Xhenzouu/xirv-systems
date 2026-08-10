import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,

    environment: "node",

    // Run tests sequentially — prevents database state collisions
    fileParallelism: false,

    // Isolate each test file
    isolate: true,

    // Timeout for tests
    testTimeout: 10000,

    setupFiles: [
      "./tests/setup.ts",
      "./tests/teardown.ts",
    ],

    // Look for tests in src/ (co-located) and tests/ (integration/helpers)
    include: [
      "src/**/*.test.ts",
      "tests/**/*.test.ts",
    ],

    exclude: [
      "node_modules",
    ],

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "html",
        "json",
      ],

      reportsDirectory: "./coverage",

      exclude: [
        "node_modules",
        "tests",
        "**/*.d.ts",
        "**/*.config.ts",
        "src/server.ts",
        "src/app.ts",
        "**/*.test.ts",
      ],
    },
  },
})