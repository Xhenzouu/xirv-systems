import { randomUUID } from "node:crypto"

import {
  api,
} from "./app.js"

import {
  defaultUser,
} from "../fixtures/users.js"

export async function createTestUser() {
  const email =
    `${randomUUID()}@example.com`

  const payload = {
    ...defaultUser,
    email,
  }

  const response =
    await api
      .post("/api/v1/auth/register")
      .send(payload)

  return {
    ...payload,
    response,
  }
}