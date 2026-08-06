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
  "PATCH /api/v1/users/profile",
  () => {
    it(
      "should update the authenticated user's profile",
      async () => {
        const auth =
          await loginAsUser()

        const response =
          await api
            .patch("/api/v1/users/profile")
            .set(
              "Authorization",
              `Bearer ${auth.accessToken}`,
            )
            .send({
              fullName:
                "Updated Test User",
              email:
                `updated-${Date.now()}@example.com`,
            })

        expect(
          response.status,
        ).toBe(200)

        expect(
          response.body.success,
        ).toBe(true)

        expect(
          response.body.data.fullName,
        ).toBe(
          "Updated Test User",
        )
      },
    )
  },
)