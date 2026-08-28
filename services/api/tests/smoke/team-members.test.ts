import { describe, expect, it, beforeAll, afterAll } from "vitest"
import { api } from "../helpers/app.js"
import { clearDatabase, disconnectDatabase } from "../helpers/database.js"
import { loginAsAdmin, loginAsUser, createTestUserDirectly } from "../helpers/auth.js"
import { prisma } from "../helpers/prisma.js"

describe("Team Member Management Smoke Tests", () => {
  let adminToken: string
  let adminUser: any
  let organizationId: string
  let teamId: string
  let memberUser: any

  beforeAll(async () => {
    await clearDatabase()
    
    // Create organization
    const org = await prisma.organization.create({
      data: {
        name: "Test Organization",
        slug: "test-org"
      }
    })
    organizationId = org.id

    // Create admin
    const admin = await loginAsAdmin()
    adminToken = admin.accessToken
    adminUser = admin

    await prisma.organizationMember.create({
      data: {
        userId: admin.id,
        organizationId: organizationId,
        role: "ADMIN"
      }
    })

    // Create a regular member user
    const userData = await createTestUserDirectly()
    memberUser = userData

    await prisma.organizationMember.create({
      data: {
        userId: memberUser.id,
        organizationId: organizationId,
        role: "MEMBER"
      }
    })

    // Create a team
    const team = await prisma.team.create({
      data: {
        name: "Engineering",
        description: "Engineering team",
        organizationId: organizationId
      }
    })
    teamId = team.id

    console.log(`📦 Organization created: ${org.name} (${organizationId})`)
    console.log(`👤 Admin: ${admin.email}`)
    console.log(`👤 Member: ${memberUser.email}`)
    console.log(`🏷️ Team created: ${team.name} (${teamId})`)
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  it("should list team members (empty initially)", async () => {
    const response = await api
      .get(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBe(0)
  })

  it("should add a member to a team", async () => {
    const response = await api
      .post(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        userId: memberUser.id,
        role: "MEMBER"
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty("id")
    expect(response.body.data.userId).toBe(memberUser.id)
    expect(response.body.data.role).toBe("MEMBER")
  })

  it("should list team members after adding", async () => {
    const response = await api
      .get(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBe(1)
    expect(response.body.data[0].userId).toBe(memberUser.id)
    expect(response.body.data[0].role).toBe("MEMBER")
  })

  it("should not allow duplicate team member", async () => {
    const response = await api
      .post(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        userId: memberUser.id,
        role: "MEMBER"
      })

    expect(response.status).toBe(409)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("already a member")
  })

  it("should update team member role to LEADER", async () => {
    const response = await api
      .patch(`/api/v1/organizations/${organizationId}/teams/${teamId}/members/${memberUser.id}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "LEADER"
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.role).toBe("LEADER")
  })

  it("should verify member role was updated", async () => {
    const response = await api
      .get(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data[0].role).toBe("LEADER")
  })

  it("should add admin as another team member", async () => {
    const response = await api
      .post(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        userId: adminUser.id,
        role: "MEMBER"
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data.userId).toBe(adminUser.id)
  })

  it("should list all team members (2 members)", async () => {
    const response = await api
      .get(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.length).toBe(2)
  })

  it("should remove a team member", async () => {
    const response = await api
      .delete(`/api/v1/organizations/${organizationId}/teams/${teamId}/members/${memberUser.id}`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toContain("removed")
  })

  it("should list team members after removal (1 member left)", async () => {
    const response = await api
      .get(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.length).toBe(1)
    expect(response.body.data[0].userId).toBe(adminUser.id)
  })

  it("should not remove the last team member", async () => {
    const response = await api
      .delete(`/api/v1/organizations/${organizationId}/teams/${teamId}/members/${adminUser.id}`)
      .set("Authorization", `Bearer ${adminToken}`)

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("Cannot remove the last member")
  })

  it("should fail to add team member with invalid user", async () => {
    const response = await api
      .post(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        userId: "invalid-user-id",
        role: "MEMBER"
      })

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
  })

  it("should require authentication", async () => {
    const response = await api
      .get(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })

  it("should require admin role to add member", async () => {
    // Create a regular user and try to add a member
    const regularUser = await loginAsUser()
    
    const response = await api
      .post(`/api/v1/organizations/${organizationId}/teams/${teamId}/members`)
      .set("Authorization", `Bearer ${regularUser.accessToken}`)
      .send({
        userId: memberUser.id,
        role: "MEMBER"
      })

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain("Access denied")
  })
})