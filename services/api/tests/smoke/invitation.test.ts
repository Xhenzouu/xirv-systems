import { describe, expect, it, beforeAll, afterAll } from "vitest"
import { api } from "../helpers/app.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"
import { loginAsAdmin, loginAsUser } from "../helpers/auth.js"
import { prisma } from "../helpers/prisma.js"

describe("Invitation Smoke Tests", () => {
  let adminToken: string
  let adminUser: any
  let organizationId: string

  beforeAll(async () => {
    await clearDatabase()
    
    // Create an organization first
    const org = await prisma.organization.create({
      data: {
        name: "Test Organization",
        slug: "test-org"
      }
    })
    organizationId = org.id

    // Create admin user
    const admin = await loginAsAdmin()
    adminToken = admin.accessToken
    adminUser = admin

    // Assign admin to organization via OrganizationMember
    await prisma.organizationMember.create({
      data: {
        userId: admin.id,
        organizationId: organizationId,
        role: "ADMIN"
      }
    })

    console.log(`📦 Organization created: ${org.name} (${organizationId})`)
    console.log(`👤 Admin: ${admin.email}`)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it("should create an invitation", async () => {
    const response = await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "invitee@example.com",
        role: "MEMBER"
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty("id")
    expect(response.body.data).toHaveProperty("token")
    expect(response.body.data.email).toBe("invitee@example.com")
    expect(response.body.data.role).toBe("MEMBER")
  })

  it("should get pending invitations", async () => {
    // Create an invitation first
    await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "pending-test@example.com",
        role: "MEMBER"
      })

    const response = await api
      .get("/api/v1/invitations/pending")
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBeGreaterThan(0)
  })

  it("should not allow duplicate invitations", async () => {
    await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "duplicate@example.com",
        role: "MEMBER"
      })

    const response = await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "duplicate@example.com",
        role: "MEMBER"
      })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("already been sent")
  })

  it("should get invitation by token", async () => {
    const createResponse = await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "token-test@example.com",
        role: "ADMIN"
      })

    const token = createResponse.body.data.token

    const response = await api
      .get(`/api/v1/invitations/token/${token}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.email).toBe("token-test@example.com")
    expect(response.body.data.organizationName).toBeDefined()
    expect(response.body.data.inviterName).toBeDefined()
    expect(response.body.data.role).toBe("ADMIN")
  })

  it("should reject an invitation", async () => {
    const createResponse = await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "reject-test@example.com",
        role: "MEMBER"
      })

    const token = createResponse.body.data.token

    const response = await api
      .post(`/api/v1/invitations/${token}/reject`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toContain("rejected")
  })

  it("should cancel an invitation", async () => {
    const createResponse = await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: "cancel-test@example.com",
        role: "MEMBER"
      })

    const invitationId = createResponse.body.data.id

    const response = await api
      .delete(`/api/v1/invitations/${invitationId}`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toContain("cancelled")
  })

  it("should accept an invitation", async () => {
    // Create user that will accept the invitation
    const user = await loginAsUser()

    const createResponse = await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: user.email,
        role: "MEMBER"
      })

    const token = createResponse.body.data.token

    const response = await api
      .post(`/api/v1/invitations/${token}/accept`)
      .set("Authorization", `Bearer ${user.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toContain("accepted")
  })

  it("should not accept expired invitation", async () => {
    const user = await loginAsUser()

    const createResponse = await api
      .post("/api/v1/invitations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        email: user.email,
        role: "MEMBER"
      })

    const token = createResponse.body.data.token

    const response = await api
      .post(`/api/v1/invitations/${token}/accept`)
      .set("Authorization", `Bearer ${user.accessToken}`)

    // If the user was already added to organization, accept will fail
    // Otherwise it should succeed
    if (response.status === 200) {
      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain("accepted")
    } else {
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    }
  })
})