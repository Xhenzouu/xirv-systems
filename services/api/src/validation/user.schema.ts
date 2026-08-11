import { z } from "zod"

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100),
  email: z
    .string()
    .trim()
    .email(),
})

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8),

  newPassword: z
    .string()
    .min(8),
})

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(8),
})