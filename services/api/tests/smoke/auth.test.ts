import { describe, expect, it } from "vitest"
import { api } from "../helpers/app.js"

describe("Authentication Smoke Tests", () => {
  // Use unique email for each test to avoid conflicts
  const testEmail = `smoke-${Date.now()}@example.com`
  const testPassword = "Password123!"

  it("should register a new user", async () => {
    const response = await api
      .post("/api/v1/auth/register")
      .send({
        firstName: "Smoke",
        lastName: "Test",
        email: testEmail,
        password: testPassword,
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
  })

  it("should login a user", async () => {
    const response = await api
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.accessToken).toBeDefined()
    expect(response.body.data.refreshToken).toBeDefined()
  })

  it("should fail login with invalid credentials", async () => {
    const response = await api
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: "WrongPassword!",
      })

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })

  it("should refresh the access token", async () => {
    const loginResponse = await api
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      })

    const refreshToken = loginResponse.body.data.refreshToken

    const response = await api
      .post("/api/v1/auth/refresh")
      .send({ refreshToken })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.accessToken).toBeDefined()
    expect(response.body.data.refreshToken).toBeDefined()
  })

  it("should logout a user", async () => {
    const loginResponse = await api
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      })

    const refreshToken = loginResponse.body.data.refreshToken

    const response = await api
      .post("/api/v1/auth/logout")
      .send({ refreshToken })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})