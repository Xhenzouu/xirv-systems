import type { Role } from "@prisma/client"

export interface AuthenticatedUser {
  id: string
  email: string
  role: Role
  firstName: string
  lastName: string
  isEmailVerified?: boolean
  emailVerifiedAt?: Date | null
  verificationToken?: string | null
  organizationId?: string | null
  avatar?: string | null
  bio?: string | null
  phone?: string | null
  createdAt?: Date
  updatedAt?: Date
}