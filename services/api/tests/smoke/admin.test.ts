import { describe, expect, it, beforeAll, afterAll } from "vitest"
import { api } from "../helpers/app.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"
import { loginAsAdmin } from "../helpers/auth.js"

describe("Admin Smoke Tests", () => {
  let adminToken: string

  beforeAll(async () => {
    await clearDatabase()
    const { accessToken } = await loginAsAdmin()
    adminToken = accessToken
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it("should list all users", async () => {
    const response = await api
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
})