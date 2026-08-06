# XIRV Systems Backend Engineering Conventions

**Project:** XIRV Systems – Enterprise Intelligence Platform
**Document Version:** 1.0
**Status:** Active
**Last Updated:** August 2026

---

# 1. Purpose

This document defines the engineering standards and coding conventions used throughout the XIRV Systems backend.

Its purpose is to ensure that every new feature, refactor, and contribution follows the same architectural principles and coding style, resulting in a consistent, maintainable, and production-ready codebase.

When uncertainty exists, this document takes precedence over individual coding preferences.

---

# 2. Guiding Principles

Every implementation should prioritize:

* Readability over cleverness.
* Consistency over personal preference.
* Simplicity over unnecessary abstraction.
* Type safety over convenience.
* Composition over duplication.
* Long-term maintainability over short-term speed.

Every new line of code should leave the project in a better state than before.

---

# 3. General Coding Standards

## TypeScript

Required:

* Strict mode enabled.
* Explicit typing where appropriate.
* Named imports.
* ES Modules.
* Modern JavaScript syntax.

Avoid:

* `any`
* Non-null assertions (`!`) unless justified.
* Type duplication.
* Implicit behavior.

---

## Formatting

Target line length:

Approximately 80–100 characters.

Use meaningful line breaks to improve readability.

Example:

```ts
const user =
  await getUserById(id)
```

instead of one long line when readability improves.

---

## Naming

Use descriptive names.

Good:

```text
authenticate
changePassword
updateProfile
findUserByEmail
```

Avoid:

```text
auth
change
update
find
data
temp
```

Names should communicate intent without requiring additional comments.

---

# 4. Folder Responsibilities

## Controllers

Responsibilities:

* Receive HTTP requests.
* Read request data.
* Call services.
* Return HTTP responses.

Controllers must NOT:

* Access Prisma.
* Hash passwords.
* Generate JWTs.
* Perform validation.
* Implement business rules.

Controllers should remain thin.

---

## Services

Responsibilities:

* Business logic.
* Business rules.
* Coordination between repositories.
* Security decisions.
* Domain behavior.

Services must NOT:

* Return HTTP responses.
* Access Express objects directly.

---

## Repositories

Responsibilities:

* Database operations only.
* Prisma queries.
* Persistence.

Repositories must NOT:

* Perform validation.
* Enforce permissions.
* Generate tokens.
* Hash passwords.
* Return HTTP responses.

---

## Middleware

Responsibilities:

* Cross-cutting concerns.

Examples:

* Authentication
* Authorization
* Validation
* Logging
* Security
* Request preprocessing

Middleware should remain reusable and independent of feature-specific business logic whenever possible.

---

## Validation

Responsibilities:

* Input validation only.

Validation belongs in middleware before controller execution.

Controllers should assume validated input.

---

# 5. Dependency Rules

Dependencies always flow downward.

```text
Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Prisma
```

Reverse dependencies are prohibited.

Examples:

❌ Repository importing a Service

❌ Controller importing Prisma

❌ Service importing Express

---

# 6. Import Conventions

Prefer barrel exports.

Preferred:

```ts
import {
  authenticate,
  authorize,
  validate,
} from "../middleware/index.js"
```

Instead of:

```ts
import { authenticate } from "../middleware/auth.middleware.js"
import { authorize } from "../middleware/authorize.js"
import { validate } from "../middleware/validate.js"
```

Every major layer should expose an `index.ts` when practical.

---

# 7. File Naming

Use feature-based naming.

Examples:

```text
user.controller.ts
user.service.ts
user.repository.ts
user.routes.ts
user.schema.ts
```

Avoid generic names.

Examples:

```text
controller.ts
service.ts
helpers.ts
utils.ts
```

---

# 8. Type Strategy

Prisma is the source of truth.

Always prefer generated Prisma types.

Example:

```ts
import type {
  Role,
  User,
} from "@prisma/client"
```

Avoid manually recreating Prisma enums or interfaces.

---

# 9. Error Handling

Business logic should throw errors.

Example:

```ts
throw new ApiError(
  404,
  "User not found.",
)
```

Services must never return HTTP responses.

Controllers should not duplicate error handling.

Global error middleware is responsible for converting exceptions into API responses.

---

# 10. Validation Rules

Validation always occurs before controllers execute.

Pipeline:

```text
Route
    ↓
validate(schema)
    ↓
Controller
```

Controllers should not manually validate request bodies.

---

# 11. Authentication Rules

Authentication is middleware.

Authenticated user information is stored on:

```ts
req.user
```

Request correlation ID is stored on:

```ts
req.requestId
```

Controllers should never decode JWTs manually.

---

# 12. Security Rules

Passwords:

* Always hashed.
* Never logged.
* Never returned.

Refresh Tokens:

* Always hashed.
* Never stored in plain text.

Access Tokens:

* Short-lived.

Never expose internal implementation details in API responses.

---

# 13. Logging Rules

Log useful information.

Never log:

* Passwords
* JWTs
* Refresh tokens
* Secrets
* Environment variables

Future logs should include:

* Request ID
* Timestamp
* HTTP Method
* URL
* Response Time

---

# 14. API Response Standards

Successful responses should use the shared response helpers.

Error responses should originate from the centralized error handler.

Response structures should remain consistent across the application.

---

# 15. Refactoring Principles

Before creating something new, ask:

* Does something similar already exist?
* Can the existing implementation be extended?
* Will this introduce duplication?

Prefer improving existing components instead of creating parallel implementations.

---

# 16. Documentation Rules

Major architectural changes should update:

* `backend-roadmap.md`
* `backend-architecture.md`
* `backend-changelog.md`

Documentation is considered part of the implementation, not an optional task.

---

# 17. Code Review Checklist

Before considering a feature complete:

* Architecture respected.
* No duplicated logic.
* No unnecessary abstractions.
* Strong typing maintained.
* Validation implemented.
* Errors handled correctly.
* API tested.
* Documentation updated.
* Imports simplified.
* Naming consistent.

---

# 18. AI Collaboration Guidelines

When using AI assistants during development:

* Preserve the existing architecture.
* Do not bypass project conventions.
* Prefer extending existing modules over creating new ones.
* Maintain consistency with established naming and layering.
* Follow the roadmap before introducing unrelated features.

AI-generated code should be reviewed against this document before being accepted.

---

# 19. Definition of Done

A feature is considered complete only when:

* Functionality is implemented.
* TypeScript compiles without errors.
* Runtime testing passes.
* Edge cases are verified.
* No architectural rules are violated.
* Documentation is updated where necessary.

---

# 20. Summary

These conventions are intended to preserve a coherent engineering style across the XIRV Systems backend. As the platform grows, consistency becomes increasingly valuable. Every contributor—including future development sessions with AI assistants—should treat this document as the authoritative guide for writing backend code.