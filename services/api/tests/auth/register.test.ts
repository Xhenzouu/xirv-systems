import {
  describe,
  expect,
  it,
} from "vitest"

import {
  createTestUser,
} from "../helpers/factories.js"

describe(
  "POST /api/v1/auth/register",
  () => {
    it(
      "should register a new user",
      async () => {
        const {
          response,
        } = await createTestUser()

        expect(
          response.status,
        ).toBe(201)

        expect(
          response.body.success,
        ).toBe(true)

        expect(
          response.body.message,
        ).toBe(
          "User registered successfully.",
        )

        expect(
          response.body.data.email,
        ).toContain(
          "@example.com",
        )
      },
    )
  },
)