import { describe, expect, it, beforeEach, afterAll } from "vitest"

import { registerUser, loginUser } from "./auth.service.js"
import { clearDatabase, disconnectDatabase } from "../../tests/helpers/database.js"

describe("Auth Service", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe("registerUser", () => {
    it("should register a new user", async () => {
      const user = await registerUser("Test", 
        "User", 
        "test@example.com", 
        "Password123!")

      expect(user).toBeDefined()
      expect(user.firstName).toBe("Test")
      expect(user.lastName).toBe("User")
      expect(user.email).toBe("test@example.com")
      expect(user.password).not.toBe("Password123!")
      expect(user.role).toBe("USER")
    })

    it("should throw if email already exists", async () => {
      // First registration
      await await registerUser("Test", 
        "User", 
        "test@example.com", 
        "Password123!")

      // Second registration with same email
      await expect(
        await registerUser(
          "Test", 
          "User", 
          "test@example.com", 
          "Password123!"
        ),
      ).rejects.toThrow("An account with this email already exists.")
    })
  })

  describe("loginUser", () => {
    it("should login a user and return tokens", async () => {
      // First register a user
      await registerUser("Test", 
        "User", 
        "test@example.com", 
        "Password123!"
      )

      const result = await loginUser(
        "test@example.com",
        "Password123!",
      )

      expect(result).toBeDefined()
      expect(result.accessToken).toBeDefined()
      expect(result.refreshToken).toBeDefined()
      expect(result.user).toBeDefined()
      expect(result.user.email).toBe("test@example.com")
    })

    it("should throw if email is invalid", async () => {
      await expect(
        loginUser("wrong@example.com", "Password123!"),
      ).rejects.toThrow("Invalid email or password.")
    })

    it("should throw if password is invalid", async () => {
      // First register a user
      await registerUser("Test", 
        "User", 
        "test@example.com", 
        "Password123!"
      )

      await expect(
        loginUser("test@example.com", "WrongPassword!"),
      ).rejects.toThrow("Invalid email or password.")
    })
  })
})