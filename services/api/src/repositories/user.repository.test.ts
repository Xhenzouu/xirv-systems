import { describe, expect, it, beforeEach, afterAll } from "vitest"

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "./user.repository.js"
import { clearDatabase, disconnectDatabase } from "../../tests/helpers/database.js"

describe("User Repository", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe("createUser", () => {
    it("should create a new user", async () => {
      const user = await createUser(
        "Repo Test User",
        "repo@example.com",
        "hashed_password",
      )

      expect(user).toBeDefined()
      expect(user.fullName).toBe("Repo Test User")
      expect(user.email).toBe("repo@example.com")
      expect(user.id).toBeDefined()
    })
  })

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      // Create a user first
      await createUser(
        "Find Test",
        "find@example.com",
        "hashed_password",
      )

      const user = await findUserByEmail("find@example.com")

      expect(user).toBeDefined()
      expect(user?.email).toBe("find@example.com")
    })

    it("should return null if user not found", async () => {
      const user = await findUserByEmail("nonexistent@example.com")

      expect(user).toBeNull()
    })
  })

  describe("findUserById", () => {
    it("should find a user by id", async () => {
      const created = await createUser(
        "Find Test User",
        "findid@example.com",
        "hashed_password",
      )

      const user = await findUserById(created.id)

      expect(user).toBeDefined()
      expect(user?.id).toBe(created.id)
    })

    it("should return null if user not found", async () => {
      const user = await findUserById("nonexistent-id")

      expect(user).toBeNull()
    })
  })
})