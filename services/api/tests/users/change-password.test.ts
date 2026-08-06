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
              currentPassword:
                "Password123!",
              newPassword:
                "NewPassword123!",
            })

        expect(
          response.status,
        ).toBe(200)

        expect(
          response.body.success,
        ).toBe(true)
      },
    )
  },
)