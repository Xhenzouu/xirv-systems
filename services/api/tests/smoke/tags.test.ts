import { describe, expect, it, beforeAll } from "vitest"
import { api } from "../helpers/app.js"
import { loginAsAdmin } from "../helpers/auth.js"

describe("Tag Smoke Tests", () => {
  let adminToken: string
  let tagId: string
  // Use a unique tag name with timestamp
  const uniqueTagName = `smoke-test-${Date.now()}`

  beforeAll(async () => {
    const { accessToken } = await loginAsAdmin()
    adminToken = accessToken
  })

  it("should create a tag", async () => {
    const response = await api
      .post("/api/v1/tags")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: uniqueTagName })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.name).toBe(uniqueTagName)

    tagId = response.body.data.id
  })

  it("should list all tags", async () => {
    const response = await api
      .get("/api/v1/tags")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
    // Check that our tag is in the list
    const found = response.body.data.some((tag: any) => tag.id === tagId)
    expect(found).toBe(true)
  })
})