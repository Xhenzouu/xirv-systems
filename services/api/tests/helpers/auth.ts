import { Role } from "@prisma/client"
import { randomUUID } from "node:crypto"
import bcrypt from "bcrypt"

import { api } from "./app.js"
import { prisma } from "./prisma.js"

export async function createTestUserDirectly() {  // Added 'export'
  const email = `${randomUUID()}@example.com`
  const password = "Password123!"
  const firstName = "Test"
  const lastName = "User"

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return {
      email: existingUser.email,
      password,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      id: existingUser.id
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: Role.USER,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    }
  })

  return {
    email,
    password,
    firstName,
    lastName,
    id: user.id
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