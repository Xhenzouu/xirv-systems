import { Role } from "@prisma/client"
import { randomUUID } from "node:crypto"

import { api } from "./app.js"
import { prisma } from "./prisma.js"

async function createTestUserDirectly() {
  const email = `${randomUUID()}@example.com`
  const password = "Password123!"
  const firstName = "Test"
  const lastName = "User"

  const response = await api
    .post("/api/v1/auth/register")
    .send({ firstName, lastName, email, password })

  if (response.status !== 201) {
    throw new Error("Failed to create test user")
  }

  return { 
    email, 
    password, 
    firstName,
    lastName,
    id: response.body.data.id 
  }
}

export async function loginAsUser() {
  const { email, password, firstName, lastName, id } = await createTestUserDirectly()

  const response = await api
    .post("/api/v1/auth/login")
    .send({ email, password })

  if (response.status !== 200) {
    throw new Error("Login failed")
  }

  return {
    id,
    email,
    password,
    firstName,
    lastName,
    response,
    accessToken: response.body.data.accessToken,
    refreshToken: response.body.data.refreshToken,
  }
}

export async function loginAsAdmin() {
  const { email, password, firstName, lastName, id } = await createTestUserDirectly()

  // Promote to admin
  await prisma.user.update({
    where: { email },
    data: { role: Role.ADMIN },
  })

  const response = await api
    .post("/api/v1/auth/login")
    .send({ email, password })

  if (response.status !== 200) {
    throw new Error("Admin login failed")
  }

  return {
    id,
    email,
    password,
    firstName,
    lastName,
    response,
    accessToken: response.body.data.accessToken,
    refreshToken: response.body.data.refreshToken,
  }
}

export async function loginAsSuperAdmin() {
  const { email, password, firstName, lastName, id } = await createTestUserDirectly()

  await prisma.user.update({
    where: { email },
    data: { role: Role.SUPER_ADMIN },
  })

  const response = await api
    .post("/api/v1/auth/login")
    .send({ email, password })

  if (response.status !== 200) {
    throw new Error("Super admin login failed")
  }

  return {
    id,
    email,
    password,
    firstName,
    lastName,
    response,
    accessToken: response.body.data.accessToken,
    refreshToken: response.body.data.refreshToken,
  }
}