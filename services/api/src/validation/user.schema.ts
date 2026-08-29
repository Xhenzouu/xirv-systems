import { z } from "zod"

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100)
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100)
    .optional(),
  email: z
    .string()
    .trim()
    .email()
    .optional(),
  avatar: z
    .string()
    .url("Invalid avatar URL")
    .nullable()
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .nullable()
    .optional(),
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters")
    .nullable()
    .optional(),
})

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),
})

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
})