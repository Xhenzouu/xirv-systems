import { describe, expect, it, beforeAll, afterAll } from "vitest"
import { api } from "../helpers/app.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"

describe("User Smoke Tests", () => {
  let accessToken: string
  const testEmail = `profile-${Date.now()}@example.com`
  const testPassword = "Password123!"

  beforeAll(async () => {
    await clearDatabase()
    // Register and login a user
    await api
      .post("/api/v1/auth/register")
      .send({
        firstName: "Profile",
        lastName: "Test",
        email: testEmail,
        password: testPassword,
      })

    const loginResponse = await api
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      })

    accessToken = loginResponse.body.data.accessToken
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it("should get the user profile", async () => {
    const response = await api
      .get("/api/v1/users/profile")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.email).toBe(testEmail)
    expect(response.body.data.firstName).toBe("Profile")
    expect(response.body.data.lastName).toBe("Test")
  })

  it("should update the user profile", async () => {
    const response = await api
      .patch("/api/v1/users/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        firstName: "Updated",
        lastName: "Profile",
        email: testEmail,
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.firstName).toBe("Updated")
    expect(response.body.data.lastName).toBe("Profile")
  })

  it("should change the user password", async () => {
    const response = await api
      .patch("/api/v1/users/password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: testPassword,
        newPassword: "NewPassword123!",
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})