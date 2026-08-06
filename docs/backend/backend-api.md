# XIRV Systems Backend API Documentation

**Project:** XIRV Systems – Enterprise Intelligence Platform
**Document Version:** 1.0
**Status:** Active
**API Version:** v1
**Base URL:** `/api/v1`
**Last Updated:** August 2026

---

# 1. Purpose

This document defines the public API contract for the XIRV Systems backend.

It describes:

* Endpoint purpose
* Authentication requirements
* Request and response formats
* Business rules
* Authorization requirements
* Error conditions
* Security considerations

This document complements OpenAPI/Swagger by explaining the intent and behavior of each endpoint.

---

# 2. API Principles

The API follows these principles:

* RESTful resource design
* JSON request and response bodies
* Stateless authentication using JWT
* Consistent response structure
* Centralized validation
* Predictable HTTP status codes
* Role-based authorization

---

# 3. Authentication

Authentication uses JWT Bearer tokens.

Example:

```http
Authorization: Bearer <access_token>
```

Access tokens are short-lived.

Refresh tokens are exchanged through the refresh endpoint and are rotated after successful use.

---

# 4. Standard Response Format

## Success

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email."
    }
  ]
}
```

## General Error

```json
{
  "success": false,
  "message": "User not found."
}
```

---

# 5. Authentication Endpoints

## POST `/auth/register`

### Purpose

Registers a new user account.

### Authentication

Not required.

### Request

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Success

**201 Created**

Returns the newly created user (excluding sensitive fields).

### Business Rules

* Email must be unique.
* Password is hashed before storage.
* New accounts receive the `USER` role.

### Possible Errors

* 400 Validation failed
* 409 Email already exists

---

## POST `/auth/login`

### Purpose

Authenticates an existing user.

### Authentication

Not required.

### Request

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Success

**200 OK**

Returns:

* Access token
* Refresh token
* User information

### Business Rules

* Password must match stored hash.
* Refresh token is hashed before storage.

### Possible Errors

* 400 Validation failed
* 401 Invalid credentials

---

## POST `/auth/refresh`

### Purpose

Issues a new access token using a valid refresh token.

### Authentication

Refresh token required.

### Request

```json
{
  "refreshToken": "<refresh_token>"
}
```

### Success

Returns:

* New access token
* New refresh token

### Business Rules

* Refresh tokens are rotated.
* Old refresh tokens become invalid immediately.
* Hashed token lookup is used.

### Possible Errors

* 401 Invalid refresh token
* 401 Expired refresh token

---

## POST `/auth/logout`

### Purpose

Invalidates the current refresh token.

### Authentication

Refresh token required.

### Request

```json
{
  "refreshToken": "<refresh_token>"
}
```

### Business Rules

* Refresh token removed from database.
* Reuse of the same token must fail.

---

# 6. User Endpoints

Authentication required for all endpoints in this section.

---

## GET `/users/profile`

### Purpose

Returns the authenticated user's profile.

### Authorization

* USER
* ADMIN
* SUPER_ADMIN

### Success

Returns authenticated user information.

---

## PATCH `/users/profile`

### Purpose

Updates profile information.

### Request

```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

### Business Rules

* Validation occurs before controller execution.
* Email uniqueness must be preserved.

---

## PATCH `/users/change-password`

### Purpose

Changes the authenticated user's password.

### Request

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Business Rules

* Current password must match.
* New password is hashed before storage.

### Possible Errors

* 401 Invalid password
* 400 Validation failed

---

## DELETE `/users/account`

### Purpose

Deletes the authenticated user's account.

### Business Rules

* Permanently removes the user.
* Associated refresh tokens should no longer be usable.

---

# 7. Administration Endpoints

Administrative endpoints require elevated privileges.

---

## GET `/admin/users`

### Purpose

Lists all users.

### Authorization

* ADMIN
* SUPER_ADMIN

### Business Rules

Returns non-sensitive user information only.

---

## GET `/admin/users/:id`

### Purpose

Returns a specific user.

### Authorization

* ADMIN
* SUPER_ADMIN

### Possible Errors

* 404 User not found

---

## PATCH `/admin/users/:id/role`

### Purpose

Updates a user's role.

### Authorization

* ADMIN
* SUPER_ADMIN

### Request

```json
{
  "role": "ADMIN"
}
```

### Business Rules

ADMIN may:

* USER → ADMIN
* ADMIN → USER

ADMIN may NOT:

* Promote to SUPER_ADMIN
* Modify a SUPER_ADMIN
* Modify their own role

SUPER_ADMIN may manage all roles.

### Possible Errors

* 403 Forbidden
* 404 User not found

---

# 8. HTTP Status Codes

| Code | Meaning               | Typical Usage                             |
| ---: | --------------------- | ----------------------------------------- |
|  200 | OK                    | Successful request                        |
|  201 | Created               | Resource created                          |
|  204 | No Content            | Successful deletion (optional future use) |
|  400 | Bad Request           | Validation failed                         |
|  401 | Unauthorized          | Missing or invalid authentication         |
|  403 | Forbidden             | Insufficient permissions                  |
|  404 | Not Found             | Resource does not exist                   |
|  409 | Conflict              | Duplicate resource (e.g., email)          |
|  500 | Internal Server Error | Unexpected server error                   |

---

# 9. Validation

All incoming payloads are validated using Zod.

Validation occurs before controllers execute.

Controllers should assume validated input.

---

# 10. Authorization Matrix

| Endpoint         | USER | ADMIN | SUPER_ADMIN |
| ---------------- | :--: | :---: | :---------: |
| Register         |   ✓  |   ✓   |      ✓      |
| Login            |   ✓  |   ✓   |      ✓      |
| Refresh          |   ✓  |   ✓   |      ✓      |
| Logout           |   ✓  |   ✓   |      ✓      |
| View Profile     |   ✓  |   ✓   |      ✓      |
| Update Profile   |   ✓  |   ✓   |      ✓      |
| Change Password  |   ✓  |   ✓   |      ✓      |
| Delete Account   |   ✓  |   ✓   |      ✓      |
| List Users       |   ✗  |   ✓   |      ✓      |
| View User        |   ✗  |   ✓   |      ✓      |
| Change User Role |   ✗  |   ✓*  |      ✓      |

*Subject to business rules described above.

---

# 11. Security Considerations

* JWT access tokens are short-lived.
* Refresh tokens are rotated after every successful refresh.
* Refresh tokens are stored hashed.
* Passwords are stored hashed.
* Role checks use the current database state.
* Validation is centralized.
* Sensitive fields are never returned in API responses.

---

# 12. Future API Modules

The API is expected to expand with:

* Organizations
* Teams
* Workspaces
* API Keys
* AI Gateway
* Knowledge Base
* Conversations
* Documents
* Embeddings
* Audit Logs
* Notifications
* Billing
* Analytics

Each module should follow the same response conventions, validation strategy, and authorization model documented here.

---

# 13. Maintenance Guidelines

This document should be updated whenever:

* A new endpoint is introduced.
* Request or response schemas change.
* Business rules are modified.
* Authorization requirements change.
* API versioning is introduced.

---

# 14. Summary

The XIRV Systems API is designed to provide a consistent, secure, and predictable interface for all platform clients. Every endpoint follows common conventions for authentication, validation, authorization, and error handling, enabling reliable integration across web, mobile, AI, and future services.