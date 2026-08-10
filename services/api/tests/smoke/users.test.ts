import { describe, expect, it, beforeAll } from "vitest"
import { api } from "../helpers/app.js"

describe("User Smoke Tests", () => {
  let accessToken: string

  beforeAll(async () => {
    // Register and login a user
    await api
      .post("/api/v1/auth/register")
      .send({
        fullName: "Profile Test User",
        email: "profile@example.com",
        password: "Password123!",
      })

    const loginResponse = await api
      .post("/api/v1/auth/login")
      .send({
        email: "profile@example.com",
        password: "Password123!",
      })

    accessToken = loginResponse.body.data.accessToken
  })

  it("should get the user profile", async () => {
    const response = await api
      .get("/api/v1/users/profile")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.email).toBe("profile@example.com")
  })

  it("should update the user profile", async () => {
    const response = await api
      .patch("/api/v1/users/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        fullName: "Updated Profile Name",
        email: "updated-profile@example.com",
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.fullName).toBe("Updated Profile Name")
  })

  it("should change the user password", async () => {
    const response = await api
      .patch("/api/v1/users/password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "Password123!",
        newPassword: "NewPassword123!",
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})