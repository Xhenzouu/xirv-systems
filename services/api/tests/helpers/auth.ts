import { Role } from "@prisma/client"
import { randomUUID } from "node:crypto"

import { api } from "./app.js"
import { prisma } from "./prisma.js"

async function createTestUserDirectly() {
  const email = `${randomUUID()}@example.com`
  const password = "Password123!"
  const fullName = "Test User"

  const response = await api
    .post("/api/v1/auth/register")
    .send({ fullName, email, password })

  if (response.status !== 201) {
    throw new Error("Failed to create test user")
  }

  return { 
    email, 
    password, 
    fullName,  // <- Make sure fullName is returned
    id: response.body.data.id 
  }
}

export async function loginAsUser() {
  const { email, password, fullName, id } = await createTestUserDirectly()

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
    fullName,  // <- Include fullName in the return
    response,
    accessToken: response.body.data.accessToken,
    refreshToken: response.body.data.refreshToken,
  }
}

export async function loginAsAdmin() {
  const { email, password, fullName, id } = await createTestUserDirectly()

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
    fullName,  // <- Include fullName in the return
    response,
    accessToken: response.body.data.accessToken,
    refreshToken: response.body.data.refreshToken,
  }
}

export async function loginAsSuperAdmin() {
  const { email, password, fullName, id } = await createTestUserDirectly()

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
    fullName,
    response,
    accessToken: response.body.data.accessToken,
    refreshToken: response.body.data.refreshToken,
  }
}