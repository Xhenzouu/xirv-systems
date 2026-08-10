import { describe, expect, it, beforeEach, afterAll } from "vitest"

import { api } from "../../tests/helpers/app.js"
import { clearDatabase, disconnectDatabase } from "../../tests/helpers/database.js"

describe("Auth Controller", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const response = await api
        .post("/api/v1/auth/register")
        .send({
          fullName: "Controller Test",
          email: "controller@example.com",
          password: "Password123!",
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.fullName).toBe("Controller Test")
      expect(response.body.data.email).toBe("controller@example.com")
    })

    it("should return 409 if email already exists", async () => {
      // First registration
      await api
        .post("/api/v1/auth/register")
        .send({
          fullName: "First User",
          email: "duplicate@example.com",
          password: "Password123!",
        })

      // Second registration with same email
      const response = await api
        .post("/api/v1/auth/register")
        .send({
          fullName: "Duplicate User",
          email: "duplicate@example.com",
          password: "Password123!",
        })

      expect(response.status).toBe(409)
      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /auth/login", () => {
    it("should login a user", async () => {
      // First register a user
      await api
        .post("/api/v1/auth/register")
        .send({
          fullName: "Login Test",
          email: "logintest@example.com",
          password: "Password123!",
        })

      const response = await api
        .post("/api/v1/auth/login")
        .send({
          email: "logintest@example.com",
          password: "Password123!",
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })

    it("should return 401 for invalid credentials", async () => {
      const response = await api
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "WrongPassword!",
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})