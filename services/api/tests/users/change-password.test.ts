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
  "PATCH /api/v1/users/password",
  () => {
    it(
      "should change the user's password",
      async () => {
        const auth =
          await loginAsUser()

        const response =
          await api
            .patch("/api/v1/users/password")
            .set(
              "Authorization",
              `Bearer ${auth.accessToken}`,
            )
            .send({
              currentPassword: auth.password,
              newPassword: "NewPassword123!",
            })

        expect(
          response.status,
        ).toBe(200)

        expect(
          response.body.success,
        ).toBe(true)

        expect(
          response.body.message,
        ).toBe(
          "Password updated successfully.",
        )
      },
    )

    it(
      "should reject requests without a token",
      async () => {
        const response =
          await api
            .patch("/api/v1/users/password")
            .send({
              currentPassword: "Password123!",
              newPassword: "NewPassword123!",
            })

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
            .patch("/api/v1/users/password")
            .set(
              "Authorization",
              "Bearer invalid-token",
            )
            .send({
              currentPassword: "Password123!",
              newPassword: "NewPassword123!",
            })

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