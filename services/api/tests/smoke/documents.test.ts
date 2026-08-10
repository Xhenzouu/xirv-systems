import { describe, expect, it, beforeAll, afterAll } from "vitest"
import { api } from "../helpers/app.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"

describe("Document Smoke Tests", () => {
  let accessToken: string
  let documentId: string
  const testEmail = `doc-${Date.now()}@example.com`
  const testPassword = "Password123!"

  beforeAll(async () => {
    await clearDatabase()
    // Register a user
    await api
      .post("/api/v1/auth/register")
      .send({
        firstName: "Doc",
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

  it("should upload a document", async () => {
    const response = await api
      .post("/api/v1/documents/upload")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("title", "Smoke Test Document")
      .field("description", "This is a smoke test document")
      .attach("file", Buffer.from("This is a test document content."), "test.txt")

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.title).toBe("Smoke Test Document")
    expect(response.body.data.id).toBeDefined()

    documentId = response.body.data.id
  })

  it("should list all documents", async () => {
    const response = await api
      .get("/api/v1/documents")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data.documents)).toBe(true)
    expect(response.body.data.total).toBeGreaterThan(0)
  })

  it("should get a specific document", async () => {
    const response = await api
      .get(`/api/v1/documents/${documentId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.id).toBe(documentId)
  })

  it("should update document status", async () => {
    const response = await api
      .patch(`/api/v1/documents/${documentId}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ status: "PUBLISHED" })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.status).toBe("PUBLISHED")
  })

  it("should delete a document", async () => {
    const response = await api
      .delete(`/api/v1/documents/${documentId}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})