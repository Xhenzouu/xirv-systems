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
  "DELETE /api/v1/users/account",
  () => {
    it(
      "should delete the authenticated account",
      async () => {
        const auth =
          await loginAsUser()

        const response =
          await api
            .delete("/api/v1/users/account")
            .set(
              "Authorization",
              `Bearer ${auth.accessToken}`,
            )
            .send({
              password:
                "Password123!",
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