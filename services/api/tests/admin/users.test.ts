import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
} from "vitest"

import {
  api,
} from "../helpers/app.js"

import {
  loginAsAdmin,
  loginAsUser,
} from "../helpers/auth.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"

describe(
  "GET /api/v1/admin/users",
  () => {
    let adminToken: string

    beforeAll(async () => {
      await clearDatabase()
      const auth = await loginAsAdmin()
      adminToken = auth.accessToken
    })

    afterAll(async () => {
      await disconnectDatabase()
    })

    it(
      "should allow an admin to retrieve all users",
      async () => {
        const response =
          await api
            .get("/api/v1/admin/users")
            .set(
              "Authorization",
              `Bearer ${adminToken}`,
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