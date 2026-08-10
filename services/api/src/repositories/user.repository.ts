import type { Role } from "@prisma/client"

import { prisma } from "../lib/prisma.js"

export async function findUserByEmail(
  email: string,
) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
  })
}

export async function findUserById(
  id: string,
) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  })
}

export async function updateUserRole(
  id: string,
  role: Role,
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  })
}

export async function findAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function updateUser(
  id: string,
  firstName: string,
  lastName: string,
  email: string,
) {
  return prisma.user.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
    },
  })
}

export async function updatePassword(
  id: string,
  password: string,
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      password,
    },
  })
}

export async function deleteUser(
  id: string,
) {
  return prisma.user.delete({
    where: {
      id,
    },
  })
}