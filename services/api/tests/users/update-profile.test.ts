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
      "should update the user's profile",
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
              firstName: "Updated",
              lastName: "Name",
              email: auth.email,
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
          "Profile updated successfully.",
        )

        expect(
          response.body.data.firstName,
        ).toBe("Updated")

        expect(
          response.body.data.lastName,
        ).toBe("Name")
      },
    )

    it(
      "should reject requests without a token",
      async () => {
        const response =
          await api
            .patch("/api/v1/users/profile")
            .send({
              firstName: "Updated",
              lastName: "Name",
              email: "test@example.com",
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