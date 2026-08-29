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
      "should update the user's profile with all fields",
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
              email: auth.email,
              phone: "+63 912 345 6789",
              bio: "Full-stack developer passionate about AI.",
              avatar: "https://example.com/avatar.jpg",
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

        expect(
          response.body.data.phone,
        ).toBe("+63 912 345 6789")

        expect(
          response.body.data.bio,
        ).toBe("Full-stack developer passionate about AI.")

        expect(
          response.body.data.avatar,
        ).toBe("https://example.com/avatar.jpg")
      },
    )

    it(
      "should update only specific fields",
      async () => {
        const response =
          await api
            .patch("/api/v1/users/profile")
            .set(
              "Authorization",
              `Bearer ${auth.accessToken}`,
            )
            .send({
              email: auth.email,
              bio: "Updated bio only",
            })

        expect(
          response.status,
        ).toBe(200)

        expect(
          response.body.success,
        ).toBe(true)

        expect(
          response.body.data.bio,
        ).toBe("Updated bio only")
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
              email: auth.email,
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