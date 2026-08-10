import { prisma } from "../lib/prisma.js"

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_CHANGE"
  | "PROFILE_UPDATE"
  | "ACCOUNT_DELETION"
  | "ROLE_CHANGE"
  | "REFRESH_TOKEN"
  | "PROFILE_RETRIEVED"
  | "ADMIN_USERS_VIEWED"
  | "ADMIN_USER_VIEWED"

export interface AuditLogData {
  userId: string
  action: AuditAction
  details?: Record<string, any>
  requestId?: string
  ip?: string
  userAgent?: string
}

export class AuditService {
  static async log(data: AuditLogData) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        details: data.details || {},
        requestId: data.requestId,
        ip: data.ip,
        userAgent: data.userAgent,
      },
    })
  }
}

export default AuditService