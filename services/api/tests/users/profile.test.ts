import {
  describe,
  expect,
  it,
} from "vitest"

import {
  api,
} from "../helpers/app.js"

import {
  loginAsUser,
} from "../helpers/auth.js"

describe(
  "GET /api/v1/users/profile",
  () => {
    it(
      "should return the authenticated user's profile",
      async () => {
        const auth =
          await loginAsUser()

        const response =
          await api
            .get("/api/v1/users/profile")
            .set(
              "Authorization",
              `Bearer ${auth.accessToken}`,
            )

        expect(
          response.status,
        ).toBe(200)

        expect(
          response.body.success,
        ).toBe(true)

        expect(
          response.body.message,
        ).toBe(
          "Profile retrieved successfully.",
        )

        expect(
          response.body.data.email,
        ).toBe(
          auth.email,
        )

        expect(
          response.body.data.firstName,
        ).toBe(
          auth.firstName,
        )

        expect(
          response.body.data.lastName,
        ).toBe(
          auth.lastName,
        )

        expect(
          response.body.data.role,
        ).toBe("USER")
      },
    )

    it(
      "should reject requests without a token",
      async () => {
        const response =
          await api.get(
            "/api/v1/users/profile",
          )

        expect(
          response.status,
        ).toBe(401)

        expect(
          response.body.success,
        ).toBe(false)
      },
    )

    it(
      "should reject an invalid token",
      async () => {
        const response =
          await api
            .get("/api/v1/users/profile")
            .set(
              "Authorization",
              "Bearer invalid-token",
            )

        expect(
          response.status,
        ).toBe(401)

        expect(
          response.body.success,
        ).toBe(false)
      },
    )
  },
)