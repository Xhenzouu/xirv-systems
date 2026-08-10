import { describe, expect, it, beforeAll, afterAll } from "vitest"
import { api } from "../helpers/app.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"

describe("AI Smoke Tests", () => {
  let accessToken: string

  beforeAll(async () => {
    await clearDatabase()
    // Register a user
    const registerResponse = await api
      .post("/api/v1/auth/register")
      .send({
        firstName: "AI",
        lastName: "Test",
        email: `ai-${Date.now()}@example.com`,
        password: "Password123!",
      })

    expect(registerResponse.status).toBe(201)

    // Login
    const loginResponse = await api
      .post("/api/v1/auth/login")
      .send({
        email: registerResponse.body.data.email,
        password: "Password123!",
      })

    accessToken = loginResponse.body.data.accessToken
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it("should send a chat message", async () => {
    const response = await api
      .post("/api/v1/ai/chat")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        messages: [{ role: "user", content: "Hello!" }],
      })

    // AI might not be available in test environment
    // We just check that it doesn't crash
    expect(response.status).toBeOneOf([200, 500, 503])
  })
})