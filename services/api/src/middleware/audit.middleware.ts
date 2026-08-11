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
  // Store the original send function
  const originalSend = res.send.bind(res)

  // Override send to intercept the response
  res.send = function (body: any) {
    // Only log if the request was successful (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const action = getAction(req)

      if (action) {
        const userId = getUserId(req, body)

        // Only log if we have a user ID
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
            // Silently fail - don't break the request
            console.error("Failed to create audit log:", err)
          })
        }
      }
    }

    // Call the original send
    return originalSend(body)
  }

  next()
}

function getAction(req: Request): string | null {
  const path = req.path
  const method = req.method

  // Handle dynamic routes
  if (path.match(/^\/api\/v1\/admin\/users\/[^/]+$/)) {
    if (method === "GET") return "ADMIN_USER_VIEWED"
    if (method === "PATCH") return "ROLE_CHANGE"
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
  // Check if user is attached to request
  if (req.user && typeof req.user === "object" && "id" in req.user) {
    return req.user.id
  }

  // For login/register, extract from response body
  if (body && typeof body === "string") {
    try {
      const parsed = JSON.parse(body)
      // Login response has user in data.user
      if (parsed?.data?.user?.id) {
        return parsed.data.user.id
      }
      // Register response has user in data (directly)
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

  // For role change, log the new role
  if (req.path.match(/^\/api\/v1\/admin\/users\/[^/]+$/) && req.method === "PATCH") {
    return { newRole: req.body.role }
  }

  // For account deletion, log it
  if (req.path === "/api/v1/users/account" && req.method === "DELETE") {
    return { deleted: true }
  }

  return undefined
}