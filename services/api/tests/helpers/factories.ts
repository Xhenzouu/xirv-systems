import { randomUUID } from "node:crypto"

import { api } from "./app.js"
import { defaultUser } from "../fixtures/users.js"

export async function createTestUser() {
  const email = `${randomUUID()}@example.com`

  const payload = {
    ...defaultUser,
    email,
  }

  const response = await api
    .post("/api/v1/auth/register")
    .send(payload)

  if (response.status !== 201) {
    console.error("REGISTRATION FAILED")
    console.error("Status:", response.status)
    console.error("Body:", response.body)
    throw new Error("Failed to create test user.")
  }

  return {
    ...payload,
    id: response.body.data.id,
    response,
  }
}