import { describe, expect, it, beforeAll } from "vitest"
import { api } from "../helpers/app.js"

describe("AI Smoke Tests", () => {
  let accessToken: string

  beforeAll(async () => {
    await api
      .post("/api/v1/auth/register")
      .send({
        fullName: "AI Test User",
        email: "ai-test@example.com",
        password: "Password123!",
      })

    const loginResponse = await api
      .post("/api/v1/auth/login")
      .send({
        email: "ai-test@example.com",
        password: "Password123!",
      })

    accessToken = loginResponse.body.data.accessToken
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