import { z } from "zod"

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3)
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