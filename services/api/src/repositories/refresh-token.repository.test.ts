import { describe, expect, it, beforeEach, afterAll } from "vitest"

import {
  createRefreshToken,
  findRefreshTokensByUser,
  deleteRefreshToken,
  deleteUserRefreshTokens,
} from "./refresh-token.repository.js"
import { createUser } from "./user.repository.js"
import { clearDatabase, disconnectDatabase } from "../../tests/helpers/database.js"

describe("RefreshToken Repository", () => {
  let userId: string

  beforeEach(async () => {
    await clearDatabase()

    const user = await createUser("Refresh", 
      "Token Test", 
      "refresh@example.com", 
      "hashed_password")
    userId = user.id
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe("createRefreshToken", () => {
    it("should create a refresh token", async () => {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      const token = await createRefreshToken(
        "hashed_token_value",
        userId,
        expiresAt,
      )

      expect(token).toBeDefined()
      expect(token.userId).toBe(userId)
      expect(token.expiresAt).toBeDefined()
    })
  })

  describe("findRefreshTokensByUser", () => {
    it("should find all refresh tokens for a user", async () => {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      await createRefreshToken("token_1", userId, expiresAt)
      await createRefreshToken("token_2", userId, expiresAt)

      const tokens = await findRefreshTokensByUser(userId)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBe(2)
      expect(tokens[0].userId).toBe(userId)
    })
  })

  describe("deleteRefreshToken", () => {
    it("should delete a refresh token", async () => {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      const token = await createRefreshToken(
        "delete_test_token",
        userId,
        expiresAt,
      )

      const deleted = await deleteRefreshToken(token.id)

      expect(deleted).toBeDefined()
      expect(deleted.id).toBe(token.id)

      const tokens = await findRefreshTokensByUser(userId)
      expect(tokens.find(t => t.id === token.id)).toBeUndefined()
    })
  })

  describe("deleteUserRefreshTokens", () => {
    it("should delete all refresh tokens for a user", async () => {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      await createRefreshToken("bulk_token_1", userId, expiresAt)
      await createRefreshToken("bulk_token_2", userId, expiresAt)

      const result = await deleteUserRefreshTokens(userId)

      expect(result.count).toBe(2)

      const tokens = await findRefreshTokensByUser(userId)
      expect(tokens.length).toBe(0)
    })
  })
})