# XIRV Systems Frontend Operations Documentation

**Project:** XIRV Systems – Enterprise Intelligence Platform  
**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** August 2026

---

## 1. Frontend Deployment

### 1.1 Purpose

This document defines the deployment infrastructure and operational process for the XIRV Systems frontend.

### 1.2 Infrastructure

The frontend is deployed as a static application using AWS S3. CloudFront and Route 53 may be used for CDN delivery and custom DNS.

| Component | Service |
|---|---|
| Hosting | AWS S3 |
| CDN | Amazon CloudFront |
| DNS | Amazon Route 53 |
| CI/CD | GitHub Actions |

Environments:

| Environment | Endpoint |
|---|---|
| Development | `http://localhost:5173` |
| Staging | S3 static website endpoint |
| Production | Custom domain |

### 1.3 Build

Build the frontend from `apps/web`:

```bash
cd apps/web
pnpm build
```

The build generates a `dist/` directory containing the static application assets.

Production API configuration is supplied at build time through `VITE_API_URL`.

### 1.4 S3 Deployment

The S3 deployment should provide `index.html` as the entry document and support SPA routing by returning `index.html` for application routes.

The deployment process synchronizes the contents of `dist/` to the frontend bucket and removes obsolete files.

The bucket should contain only public static application assets. Sensitive information must never be placed in the bucket.

### 1.5 CloudFront

When CloudFront is enabled:

- Redirect HTTP traffic to HTTPS.
- Use `index.html` as the default root object.
- Configure SPA error handling so application routes resolve correctly.
- Invalidate cached objects after deployments when required.

### 1.6 CI/CD

GitHub Actions should automatically build and deploy changes to the frontend when relevant files are pushed to the deployment branch.

The pipeline should:

1. Check out the repository.
2. Install the required Node.js and pnpm dependencies.
3. Build `apps/web`.
4. Deploy the generated `dist/` directory to S3.
5. Invalidate CloudFront when a distribution is configured.

AWS credentials and deployment configuration must be stored in GitHub Secrets rather than committed to the repository.

### 1.7 Deployment Checklist

Before deployment:

- [ ] Tests pass.
- [ ] TypeScript compiles without errors.
- [ ] Required environment variables are configured.
- [ ] Production build succeeds.
- [ ] Bundle size is acceptable.
- [ ] Security configuration is present.
- [ ] Production API URL is correct.

After deployment:

- [ ] Application loads.
- [ ] API connectivity works.
- [ ] Authentication works.
- [ ] Application routes are accessible.
- [ ] Static assets load.
- [ ] SPA fallback works.
- [ ] Deployment logs show no critical errors.

### 1.8 Rollback

Rollback should restore the last known-good source revision and redeploy it.

Recommended process:

1. Identify the last known-good commit or deployment.
2. Revert or check out the appropriate revision.
3. Rebuild the frontend.
4. Synchronize the new build to S3.
5. Invalidate CloudFront if applicable.
6. Verify the application and API connectivity.

### 1.9 Monitoring

Operational monitoring should cover:

- S3 and CloudFront errors.
- Request volume.
- Availability.
- Deployment failures.
- Cloud costs.
- Application errors where frontend monitoring is available.

---

## 2. Frontend Security

### 2.1 Purpose

Frontend security provides client-side protections as one layer of the platform's overall defense-in-depth strategy. Backend authorization and validation remain authoritative.

### 2.2 Security Principles

- Never trust client-side validation.
- Never place secrets in frontend source or build-time public configuration.
- Protect authentication credentials.
- Use HTTPS for production communication.
- Do not expose sensitive data unnecessarily.
- Avoid logging credentials or sensitive information.

### 2.3 Authentication

The frontend currently uses access and refresh tokens.

The documented implementation stores the access token in `localStorage`. This is convenient but increases exposure if an XSS vulnerability exists. Token handling should therefore be treated as a security-sensitive area and reviewed before production hardening.

Security requirements include:

- Use short-lived access tokens.
- Rotate refresh tokens.
- Send access tokens through the `Authorization` header.
- Never place tokens in URLs.
- Never log access or refresh tokens.
- Clear authentication state when a session can no longer be refreshed.

### 2.4 XSS Prevention

React's normal rendering escapes user-provided content. Avoid APIs that intentionally inject untrusted HTML.

If HTML must be rendered, sanitize it using an established sanitization mechanism before insertion.

Content Security Policy should restrict script and resource execution to trusted origins and should be configured as part of the deployment architecture.

### 2.5 CSRF and Cross-Origin Controls

The application should use appropriate cookie and cross-origin controls when cookies are used for authentication.

Required considerations include:

- SameSite cookie policy.
- CSRF protection for cookie-authenticated state-changing requests.
- Strict CORS configuration.
- Origin validation where appropriate.

Token-based authorization headers reduce traditional CSRF exposure, but they do not eliminate other browser security risks.

### 2.6 API Security

Authenticated API requests use:

```text
Authorization: Bearer <access-token>
```

The backend remains responsible for authentication, authorization, validation, and rate limiting.

Frontend error messages should provide useful user-facing information without exposing internal stack traces, credentials, database details, or other sensitive implementation information.

### 2.7 Data Privacy

Do not store sensitive application data in:

- `localStorage`.
- `sessionStorage`.
- URL parameters.
- Client-accessible cookies unless there is a justified design.

Only request and display data required for the current authenticated user and operation.

### 2.8 Environment and Secrets

Frontend environment variables are public after the application is built. They are appropriate for configuration such as API endpoints, but not for secrets.

Secrets belong in protected systems such as GitHub Secrets or backend/server-side secret management.

### 2.9 Security Review Checklist

- [ ] No hardcoded secrets.
- [ ] No tokens in URLs or logs.
- [ ] No unsafe HTML injection.
- [ ] Input handling is validated.
- [ ] HTTPS is enforced in production.
- [ ] CORS is restricted appropriately.
- [ ] Security headers are configured.
- [ ] Dependencies are regularly reviewed.
- [ ] Production configuration contains no secret values.

---

## 3. Frontend Development Best Practices

### 3.1 Purpose

These practices establish common development expectations for maintainable, performant, accessible frontend code.

### 3.2 Code Organization

Prefer feature-oriented organization so related pages, components, styles, hooks, and services remain easy to locate.

Example:

```text
pages/Workflows/
├── index.tsx
├── create.tsx
├── [id].tsx
├── tasks.tsx
└── Workflows.css
```

Shared functionality should remain in appropriate shared component, hook, service, or utility locations.

### 3.3 Component Design

Components should have a clear responsibility and explicit props.

Prefer composition for reusable UI rather than large configuration objects.

Good component design should:

- Keep responsibilities focused.
- Expose clear interfaces.
- Avoid unnecessary coupling.
- Reuse shared components where appropriate.
- Keep presentation separate from complex data logic.

### 3.4 State Management

Use local state by default. Introduce shared or global state only when multiple areas genuinely need the same state.

Prefer derived values over duplicated state.

Keep state minimal and avoid storing values that can be calculated from existing state or server data.

### 3.5 Performance

Use performance optimizations when they address measurable problems.

Relevant techniques include:

- `React.memo` for demonstrably expensive components.
- `useMemo` for expensive derived calculations.
- `useCallback` when stable references are useful.
- Route-level code splitting.
- Lazy loading.
- Virtualization for large collections.

Avoid adding memoization indiscriminately.

### 3.6 Accessibility

Use semantic HTML and accessible native controls first.

Requirements include:

- Keyboard accessibility.
- Visible focus states.
- Appropriate labels.
- Correct ARIA usage where needed.
- Proper focus management.
- Meaningful alternative text.
- Respect for reduced-motion preferences.

### 3.7 Error Handling

Use error boundaries for unexpected rendering failures and consistent application-level handling for API errors.

User-facing errors should be actionable and appropriately generic. Detailed diagnostics should remain in development or controlled logging systems.

### 3.8 Styling

Use CSS variables for shared design tokens and theme values.

Keep styles scoped to the relevant feature or component. Avoid unnecessary `!important` declarations and excessive selector specificity.

### 3.9 Testing

Frontend changes should include appropriate automated coverage.

Prioritize:

- Component behavior.
- Integration points.
- Loading, empty, and error states.
- Critical user workflows.
- Accessibility behavior where relevant.

Tests should verify behavior rather than implementation details.

### 3.10 Documentation

Document complex logic, public component interfaces, and non-obvious architectural decisions.

Documentation should be updated when the corresponding implementation changes.

---

## 4. Frontend Glossary

### Architecture

**Component** — A reusable UI element with a defined responsibility.

**Page** — A complete application view associated with a route.

**Layout** — A reusable wrapper providing common page structure.

**Hook** — A function that encapsulates React stateful or lifecycle-related behavior.

**Context** — A React mechanism for providing shared values to a component subtree.

**Service** — A module responsible for communication with an external system, such as the backend API.

### UI and State

**Container** — A component or module responsible primarily for data and application logic.

**Presentational Component** — A component primarily responsible for rendering UI.

**Compound Component** — A group of related components designed to work together.

**Local State** — State owned by an individual component or feature.

**Global State** — State shared across multiple parts of the application.

**Server State** — Data retrieved from or synchronized with the backend.

**Form State** — User-entered form values and validation state.

### Performance

**Code Splitting** — Dividing application code into independently loaded bundles.

**Lazy Loading** — Deferring loading until functionality is needed.

**Memoization** — Reusing previously computed results when inputs have not changed.

**Virtualization** — Rendering only the visible portion of a large collection.

### Testing

**Unit Test** — A test of isolated logic.

**Integration Test** — A test of interactions between multiple application units.

**E2E Test** — A test of a complete user workflow.

**Mock** — A controlled substitute for a dependency during testing.

### Build

**Bundle** — Compiled application resources prepared for delivery.

**Minification** — Reducing file size by removing unnecessary characters and transformations.

**Tree Shaking** — Removing unused code from production bundles.

**Polyfill** — Compatibility code that provides functionality missing from a target environment.

---

## 5. Frontend Troubleshooting

### 5.1 Purpose

This guide provides a first-response procedure for common frontend development and runtime problems.

### 5.2 Build Problems

**TypeScript errors**

Check the compiler output and run the project's type-checking command. Resolve type errors before deployment.

**Build hangs or takes too long**

Check for infinite loops, unusually large dependencies, expensive build plugins, or unexpectedly large generated assets.

**Build output is too large**

Inspect bundle composition, remove unnecessary dependencies, and apply appropriate code splitting or lazy loading.

### 5.3 Runtime Problems

**Page does not load**

Check, in order:

1. Browser console errors.
2. Network failures.
3. API availability.
4. Environment configuration.
5. Routing configuration.

**Component does not render**

Verify:

1. Component imports.
2. Props.
3. Conditional rendering.
4. State values.
5. Runtime errors.

**Infinite re-renders**

Check effect dependencies, state updates performed during rendering, and callbacks that change identity unnecessarily.

### 5.4 API Problems

**401 Unauthorized**

Check access-token validity, whether the authorization header is present, and whether token refresh is functioning.

**404 Not Found**

Verify the endpoint URL, backend route, resource identifier, and frontend routing configuration.

**500 Internal Server Error**

Inspect backend logs and verify the request payload and API contract. A 500 response generally requires backend investigation rather than a frontend-only fix.

### 5.5 Performance Problems

**Slow page load**

Check bundle size, image payloads, API latency, and route-level loading behavior.

**Laggy interactions**

Use React DevTools and browser performance tools to identify expensive renders, excessive state updates, large lists, or expensive computations before applying optimizations.

### 5.6 Styling Problems

**Styles not applying**

Check stylesheet imports, class names, selector specificity, CSS module behavior if applicable, and browser inspection tools.

**Broken layout**

Check responsive rules, flex/grid configuration, container sizing, overflow behavior, and viewport-specific styles.

### 5.7 Debugging Tools

Use:

- Browser Console for runtime errors.
- Network panel for requests and responses.
- Elements panel for DOM and styles.
- React DevTools for component state and rendering.
- TypeScript/VS Code diagnostics for compile-time issues.
- Browser Performance tools for CPU, memory, and rendering analysis.

### 5.8 Common Errors

| Error | Meaning |
|---|---|
| `Cannot read property of undefined` | Code accessed a value that is currently undefined. |
| `ReferenceError: X is not defined` | A required variable or import is unavailable. |
| `Objects are not valid as a React child` | An object was passed where React expected renderable content. |
| `Each child in a list should have a unique "key"` | List elements are missing stable React keys. |

---

## 6. Documentation Index

### 6.1 Purpose

This directory is the frontend engineering knowledge base for XIRV Systems.

The documentation set is intended to cover:

- Architecture.
- Coding conventions.
- Components.
- Routing.
- State management.
- Styling.
- API integration.
- Performance.
- Testing.
- Accessibility.
- Deployment.
- Security.
- Best practices.
- Troubleshooting.
- Terminology.

### 6.2 Recommended Reading Order

For new developers:

1. `frontend-architecture.md`
2. `frontend-conventions.md`
3. `frontend-routing.md`
4. `frontend-components.md`

For feature development:

1. `frontend-components.md`
2. `frontend-api-integration.md`
3. `frontend-testing.md`

For operations:

1. `frontend-deployment.md`
2. `frontend-security.md`
3. `frontend-troubleshooting.md`

### 6.3 Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| React Router v7 | Routing |
| Lucide React | Icons |
| Recharts | Charts |
| Axios | HTTP client |
| CSS | Styling |

### 6.4 Development Standards

The frontend follows these baseline standards:

- TypeScript strict mode.
- ESLint for code quality.
- Component-based architecture.
- Feature-oriented organization.
- CSS variables for shared design values.
- Accessibility by default.
- Automated testing for important behavior.
- Documentation maintained alongside significant architectural changes.

### 6.5 Documentation Maintenance

Documentation should describe the current implementation rather than planned functionality that has not been implemented.

When architecture, deployment, security, or development conventions change, update the relevant document in the same change set whenever practical.