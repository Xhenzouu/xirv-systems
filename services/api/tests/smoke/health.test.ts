import { describe, expect, it } from "vitest"
import { api } from "../helpers/app.js"

describe("Health Check", () => {
  it("should respond to a simple health check", async () => {
    const response = await api.get("/")
    expect(response.status).toBe(404) // No root route defined, that's fine
  })
})