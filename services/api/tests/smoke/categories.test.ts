import { describe, expect, it, beforeAll } from "vitest"
import { api } from "../helpers/app.js"
import { loginAsAdmin } from "../helpers/auth.js"

describe("Category Smoke Tests", () => {
  let adminToken: string
  let categoryId: string

  beforeAll(async () => {
    const { accessToken } = await loginAsAdmin()
    adminToken = accessToken
  }, 30000)

  it("should create a category", async () => {
    const response = await api
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `Smoke Test Category ${Date.now()}`,
        description: "Category for smoke tests",
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)

    categoryId = response.body.data.id
  })

  it("should list all categories", async () => {
    const response = await api
      .get("/api/v1/categories")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
})