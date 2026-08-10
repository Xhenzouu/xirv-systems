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
  loginAsUser,
} from "../helpers/auth.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"

describe(
  "PATCH /api/v1/users/profile",
  () => {
    let auth: any

    beforeAll(async () => {
      await clearDatabase()
      auth = await loginAsUser()
    })

    afterAll(async () => {
      await disconnectDatabase()
    })

    it(
      "should update the user's profile",
      async () => {
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