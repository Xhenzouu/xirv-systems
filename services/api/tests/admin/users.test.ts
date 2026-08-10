import {
  describe,
  expect,
  it,
} from "vitest"

import {
  api,
} from "../helpers/app.js"

import {
  loginAsAdmin,
  loginAsUser,
} from "../helpers/auth.js"

describe(
  "GET /api/v1/admin/users",
  () => {
    it(
      "should allow an admin to retrieve all users",
      async () => {
        const auth =
          await loginAsAdmin()

        const response =
          await api
            .get("/api/v1/admin/users")
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
          Array.isArray(
            response.body.data,
          ),
        ).toBe(true)
      },
    )

    it(
      "should reject a normal user",
      async () => {
        const auth =
          await loginAsUser()

        const response =
          await api
            .get("/api/v1/admin/users")
            .set(
              "Authorization",
              `Bearer ${auth.accessToken}`,
            )

        expect(
          response.status,
        ).toBe(403)

        expect(
          response.body.success,
        ).toBe(false)
      },
    )

    it(
      "should reject requests without a token",
      async () => {
        const response =
          await api
            .get("/api/v1/admin/users")

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