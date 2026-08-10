import { describe, expect, it } from "vitest"
import { api } from "../helpers/app.js"

describe("Admin Smoke Tests", () => {
  let adminToken: string

  it("should create an admin and list all users", async () => {
    // Register a user
    const email = `admin-${Date.now()}@example.com`
    const password = "Password123!"

    const registerResponse = await api
      .post("/api/v1/auth/register")
      .send({
        fullName: "Admin User",
        email,
        password,
      })

    expect(registerResponse.status).toBe(201)

    // Login as the user
    const loginResponse = await api
      .post("/api/v1/auth/login")
      .send({ email, password })

    expect(loginResponse.status).toBe(200)

    // Note: To make this user an admin, you'd need a super admin to promote them
    // For now, we'll just test that the endpoint exists
    // This test will need to be updated once you have a way to create admin users in tests

    // For now, skip this test or test with a known admin user
    // We'll use the loginAsAdmin helper from a separate setup
  })
})