import type {
  NextFunction,
  Request,
  Response,
} from "express"

import { AuditService } from "../services/audit.service.js"
import type { AuditAction } from "../services/audit.service.js"

export async function auditLog(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalSend = res.send.bind(res)

  res.send = function (body: any) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const action = getAction(req)

      if (action) {
        const userId = getUserId(req, body)

        if (userId) {
          const details = getDetails(req, body)

          AuditService.log({
            userId,
            action: action as AuditAction,
            details,
            requestId: req.requestId,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
          }).catch((err) => {
            console.error("Failed to create audit log:", err)
          })
        }
      }
    }

    return originalSend(body)
  }

  next()
}

function getAction(req: Request): string | null {
  const path = req.path
  const method = req.method

  // SUPER_ADMIN role change
  if (path.match(/^\/api\/v1\/admin\/super\/users\/[^/]+\/role$/)) {
    if (method === "PATCH") return "ROLE_CHANGE"
  }

  // Admin user actions
  if (path.match(/^\/api\/v1\/admin\/users\/[^/]+$/)) {
    if (method === "GET") return "ADMIN_USER_VIEWED"
  }

  // Organization routes
  if (path.match(/^\/api\/v1\/organizations\/[^/]+$/)) {
    if (method === "POST") return "ORGANIZATION_CREATED"
    if (method === "PATCH") return "ORGANIZATION_UPDATED"
    if (method === "DELETE") return "ORGANIZATION_DELETED"
  }

  if (path.match(/^\/api\/v1\/organizations\/[^/]+\/members$/)) {
    if (method === "POST") return "MEMBER_ADDED"
    if (method === "GET") return "MEMBERS_VIEWED"
  }

  if (path.match(/^\/api\/v1\/organizations\/[^/]+\/members\/[^/]+\/role$/)) {
    if (method === "PATCH") return "MEMBER_ROLE_UPDATED"
  }

  // Exact route matches
  const actions: Record<string, string> = {
    "POST /api/v1/auth/register": "REGISTER",
    "POST /api/v1/auth/login": "LOGIN",
    "POST /api/v1/auth/refresh": "REFRESH_TOKEN",
    "POST /api/v1/auth/logout": "LOGOUT",
    "GET /api/v1/users/profile": "PROFILE_RETRIEVED",
    "PATCH /api/v1/users/profile": "PROFILE_UPDATE",
    "PATCH /api/v1/users/password": "PASSWORD_CHANGE",
    "DELETE /api/v1/users/account": "ACCOUNT_DELETION",
    "GET /api/v1/admin/users": "ADMIN_USERS_VIEWED",
  }

  return actions[`${method} ${path}`] || null
}

function getUserId(req: Request, body: any): string | null {
  // Check if user is attached to request (authenticated user)
  if (req.user && typeof req.user === "object" && "id" in req.user) {
    return req.user.id
  }

  // For login/register, extract from response body
  if (body && typeof body === "string") {
    try {
      const parsed = JSON.parse(body)
      if (parsed?.data?.user?.id) {
        return parsed.data.user.id
      }
      if (parsed?.data?.id) {
        return parsed.data.id
      }
    } catch {
      // Not JSON, ignore
    }
  }

  return null
}

function getDetails(req: Request, body: any): Record<string, any> | undefined {
  const details: Record<string, any> = {}

  // For login, we don't want to log passwords
  if (req.path === "/api/v1/auth/login") {
    return { email: req.body?.email }
  }

  // For register, don't log password
  if (req.path === "/api/v1/auth/register") {
    return { 
      email: req.body?.email, 
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
    }
  }

  // For profile update, log what changed
  if (req.path === "/api/v1/users/profile" && req.method === "PATCH") {
    const changes: Record<string, any> = {}
    if (req.body.firstName) changes.firstName = req.body.firstName
    if (req.body.lastName) changes.lastName = req.body.lastName
    if (req.body.email) changes.email = req.body.email
    return changes
  }

  // For role change (SUPER_ADMIN), log the new role
  if (pathMatch(req.path, /^\/api\/v1\/admin\/super\/users\/[^/]+\/role$/) && req.method === "PATCH") {
    return { newRole: req.body.role }
  }

  // For admin role change, log the new role
  if (pathMatch(req.path, /^\/api\/v1\/admin\/users\/[^/]+$/) && req.method === "PATCH") {
    return { newRole: req.body.role }
  }

  // For account deletion, log it
  if (req.path === "/api/v1/users/account" && req.method === "DELETE") {
    return { deleted: true }
  }

  return undefined
}

function pathMatch(path: string, pattern: RegExp): boolean {
  return pattern.test(path)
}