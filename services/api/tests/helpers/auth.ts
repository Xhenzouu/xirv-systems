import {
  Role,
} from "@prisma/client"

import {
  api,
} from "./app.js"

import {
  createTestUser,
} from "./factories.js"

import {
  prisma,
} from "./prisma.js"

export async function loginAsUser() {
  const user =
    await createTestUser()

  const response =
  await api
    .post("/api/v1/auth/login")
    .send({
      email: user.email,
      password: user.password,
    })

    if (response.status !== 200) {
    console.error("LOGIN FAILED")
    console.error("Status:", response.status)
    console.error("Body:", response.body)

    throw new Error("Login failed.")
    }

  return {
    ...user,
    response,
    accessToken:
      response.body.data.accessToken,
    refreshToken:
      response.body.data.refreshToken,
  }
}

export async function loginAsAdmin() {
  const admin =
    await createTestUser()

  await prisma.user.update({
    where: {
      email: admin.email,
    },
    data: {
      role: Role.ADMIN,
    },
  })

  const response =
  await api
    .post("/api/v1/auth/login")
    .send({
      email: admin.email,
      password: admin.password,
    })

    if (response.status !== 200) {
    console.error("LOGIN FAILED")
    console.error("Status:", response.status)
    console.error("Body:", response.body)

    throw new Error("Login failed.")
    }

  return {
    ...admin,
    response,
    accessToken:
      response.body.data.accessToken,
    refreshToken:
      response.body.data.refreshToken,
  }
}

export async function loginAsSuperAdmin() {
  const admin =
    await createTestUser()

  await prisma.user.update({
    where: {
      email: admin.email,
    },
    data: {
      role: Role.SUPER_ADMIN,
    },
  })

  const response =
    await api
      .post("/api/v1/auth/login")
      .send({
        email: admin.email,
        password: admin.password,
      })

  return {
    ...admin,
    response,
    accessToken:
      response.body.data.accessToken,
    refreshToken:
      response.body.data.refreshToken,
  }
}