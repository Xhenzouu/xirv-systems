# XIRV Systems Frontend API Integration

**Project:** XIRV Systems – Enterprise Intelligence Platform  
**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** August 2026

---

## 1. Purpose

This document defines how the XIRV Systems frontend communicates with the backend API. It covers the HTTP client, authentication, service organization, API domains, error handling, environment configuration, and shared response types.

## 2. HTTP Client Architecture

The frontend uses Axios as the primary HTTP client.

The client is responsible for:

- Defining the API base URL.
- Applying JSON request headers.
- Attaching the JWT access token to authenticated requests.
- Handling `401 Unauthorized` responses.
- Refreshing expired access tokens when a refresh token is available.
- Clearing authentication state and redirecting to `/login` when refresh fails.

The base URL is configured through `VITE_API_URL`, with the development API used as the fallback.

**Client location:** `api/client.ts`

## 3. Authentication

Authentication is exposed through a dedicated service supporting login, registration, token refresh, logout, and profile retrieval. The frontend uses access and refresh tokens and supports `USER`, `ADMIN`, and `SUPER_ADMIN` roles.

## 4. API Service Organization

API services are organized by domain so that endpoint logic remains separated from UI components.

```text
api/
├── client.ts
├── auth.ts
├── users.ts
├── documents.ts
├── categories.ts
├── tags.ts
├── workflows.ts
├── ai.ts
├── rag.ts
├── analytics.ts
└── index.ts
```

Services should expose typed functions rather than requiring components to construct API requests directly.

## 5. Workflow API

The workflow service supports workflow listing, retrieval, creation, updates, status changes, deletion, and execution. It also supports task listing/retrieval/status updates and approval listing/status updates with optional comments.

## 6. Document, Category, and Tag APIs

The document service supports listing, retrieval, upload with metadata, updates, status changes, deletion, and tag management. Category and tag services support their respective listing, creation, update, and deletion operations. Document uploads use `multipart/form-data`; normal requests use JSON.

## 7. AI and RAG APIs

The AI service supports standard chat requests and streaming chat responses.

The chat API accepts:

- Conversation messages.
- Optional model selection.
- Optional temperature.
- Optional maximum token count.

The RAG service supports:

- Submitting questions against the knowledge base.
- Optionally limiting a query to a document.
- Returning an answer, sources, and optional usage information.
- Processing documents into searchable chunks.

Streaming AI responses are handled separately from normal Axios requests because the frontend consumes streamed response data.

## 8. Analytics API

The analytics service provides dashboard and domain-specific statistics.

Supported operations include:

- Dashboard statistics.
- Document statistics.
- Workflow statistics.
- AI usage statistics.

Date-range parameters may be supplied to time-based analytics endpoints.

## 9. Error Handling

The frontend should use a consistent API error structure:

- HTTP status code.
- Human-readable message.
- Optional field or validation errors.

Common status handling:

| Status | Frontend behavior |
|---|---|
| `401` | Re-authenticate or redirect to login |
| `403` | Display permission error |
| `404` | Display resource-not-found state |
| Other errors | Display an appropriate generic error |

Errors should be handled at the service or application boundary rather than duplicated across individual components.

## 10. Environment Configuration

Development:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Production should use the deployed API endpoint appropriate for the XIRV Systems environment.

Environment variables must not contain secrets intended to remain private from the browser.

## 11. Shared API Types

Shared types cover pagination, search/sorting parameters, list responses, and generic API responses. Maintain these in `types/api.ts` for consistency.

## 12. Implementation Principles

The frontend API layer should:

- Keep HTTP concerns out of presentation components.
- Use typed request and response models.
- Centralize authentication behavior.
- Use consistent endpoint naming.
- Handle loading and error states at the UI boundary.
- Avoid duplicating API request logic.
- Keep service modules focused on a single domain.

## 13. Summary

The XIRV Systems frontend API layer uses Axios, domain-oriented services, centralized authentication handling, typed responses, and consistent error processing. This structure provides a maintainable boundary between the frontend application and backend services as the platform expands.

# XIRV Systems Frontend Performance

**Project:** XIRV Systems – Enterprise Intelligence Platform  
**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** August 2026

---

## 1. Purpose

This document defines the performance practices for the XIRV Systems frontend, with emphasis on load performance, rendering efficiency, network usage, memory management, and monitoring.

## 2. Performance Goals

The frontend should aim for:

- Fast initial loading.
- Responsive user interactions.
- Efficient data fetching.
- Reasonable JavaScript bundle sizes.
- Efficient rendering.
- Strong Core Web Vitals performance.

## 3. Bundle Optimization

The application uses Vite. Use route-level code splitting, lazy loading for large features, tree shaking, dependency cleanup, and regular bundle-size monitoring. Validate production builds with `pnpm build`.

## 4. Component Rendering

React rendering should be optimized based on measured performance rather than premature optimization.

Use:

- Local state where possible.
- `React.memo` for demonstrably expensive components.
- `useMemo` for expensive derived calculations.
- `useCallback` where stable function references provide a measurable benefit.

Avoid unnecessary global state and unnecessary component re-renders.

React DevTools should be used to identify actual rendering bottlenecks.

## 5. Images and Static Assets

Images should be optimized before deployment.

Guidelines:

- Prefer SVG for suitable vector assets.
- Use WebP or AVIF for supported raster assets.
- Provide explicit image dimensions where practical.
- Lazy-load images that are outside the initial viewport.
- Avoid unnecessarily large source images.

## 6. CSS

CSS should remain lightweight and maintainable.

Recommended practices:

- Use CSS variables for shared design values.
- Avoid unnecessarily deep selectors.
- Keep styles scoped to the relevant component or feature.
- Rely on production minification.
- Avoid shipping unused styles.

Critical above-the-fold styling should be prioritized when profiling identifies CSS as a bottleneck.

## 7. API and Data Fetching

Control network usage through batching, pagination, appropriate caching, debounced search, duplicate-request prevention, and progressive loading. Do not fetch entire large collections when only a subset is required.

## 8. Loading States

Interfaces should communicate progress without blocking unnecessarily.

Recommended patterns:

- Skeleton loading for content-heavy views.
- Explicit loading indicators for actions.
- Progressive rendering of independent sections.
- Useful empty states.
- Clear error states.

## 9. Caching

Caching should be applied according to data lifetime and sensitivity.

Potential caching layers include:

- Browser caching for static assets.
- HTTP caching headers.
- Application-level query caching.
- Local storage for appropriate non-sensitive client data.

Authentication credentials and sensitive information should not be cached indiscriminately.

## 10. Network Optimization

The deployment environment should support:

- Compression such as Brotli or gzip where applicable.
- CDN delivery for static assets.
- HTTP/2 or newer transport where supported.
- Efficient cache headers.
- Minimal unnecessary network requests.

## 11. Runtime Performance

For large interfaces, consider list virtualization, debounced input, throttled scroll/resize handlers, and Web Workers for genuinely heavy computation.

## 12. Memory Management

Components must clean up resources when they unmount.

This includes:

- Event listeners.
- Subscriptions.
- Timers.
- Streaming connections.
- Pending requests where cancellation is supported.
- Other external resources.

Large objects should not be retained longer than necessary.

## 13. Monitoring

Use browser DevTools, Lighthouse, React DevTools, bundle analysis, and application monitoring where available. Track LCP, CLS, and INP; use INP rather than the older FID metric for current Core Web Vitals reporting.

## 14. Performance Budgets

The project should establish measurable budgets for:

- JavaScript bundle size.
- Initial page payload.
- Image size.
- API response time.
- Core Web Vitals.

Budgets should be reviewed as major features are added.

## 15. Summary

XIRV Systems should treat frontend performance as an ongoing engineering concern. Route-level code splitting, efficient rendering, controlled network usage, optimized assets, appropriate caching, and continuous measurement provide the foundation for a responsive application.

# XIRV Systems Frontend Testing

**Project:** XIRV Systems – Enterprise Intelligence Platform  
**Document Version:** 1.0  
**Status:** Planned  
**Last Updated:** August 2026

---

## 1. Purpose

This document defines the testing strategy for the XIRV Systems frontend, including test levels, tools, coverage expectations, CI execution, and testing practices.

## 2. Testing Philosophy

The frontend testing strategy follows these principles:

- Test user-visible behavior rather than implementation details.
- Keep tests focused and maintainable.
- Test critical workflows thoroughly.
- Isolate tests where practical.
- Balance coverage with development effort.

## 3. Test Levels

- **Unit:** Individual functions, hooks, and utilities.
- **Component:** Rendered UI and user interaction.
- **Integration:** Interactions between frontend pieces, state, and API boundaries.
- **E2E:** Complete user workflows in a browser.

## 4. Testing Tools

| Tool | Purpose |
|---|---|
| Vitest | Unit and frontend test runner |
| React Testing Library | Component and DOM behavior testing |
| Playwright | End-to-end browser testing |
| MSW | API request mocking |
| Testing Library utilities | User-oriented DOM testing |

## 5. Unit and Hook Testing

Cover initial state, expected outputs, state transitions, errors, and important edge cases. Prefer behavior-based assertions over implementation details.

## 6. Component Testing

Verify rendering, interactions, loading/empty/error states, accessibility behavior, and mocked API integration. Give focused coverage to workflow, document, authentication, and AI interfaces.

## 7. API Mocking

Use MSW for predictable API responses. Cover successful requests plus authentication, validation, permission, not-found, and server failures. Keep mocks aligned with the actual API contract.

## 8. End-to-End Testing

Playwright should cover authentication, dashboard access, workflow management/creation/execution, document management, AI functionality, and important failure states. Use stable selectors and controlled test data.

## 9. Test Coverage

The original testing plan establishes the following targets:

| Test Type | Target |
|---|---:|
| Unit Tests | 80%+ |
| Integration Tests | 70%+ |
| Component Tests | 80%+ |

Coverage targets should be treated as quality indicators rather than a substitute for meaningful tests.

## 10. Continuous Integration

Frontend tests should run automatically for pushes and pull requests.

A CI pipeline should:

1. Install dependencies.
2. Run unit and component tests.
3. Generate coverage where required.
4. Run E2E tests.
5. Fail the pipeline when required checks fail.

Example commands:

```bash
pnpm test
pnpm test:e2e
pnpm test --coverage
```

## 11. Test Environment

Frontend tests should use a dedicated environment configuration.

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Test credentials and test data should be isolated from production resources.

## 12. Best Practices

### General

- Write tests alongside features.
- Use meaningful test descriptions.
- Keep tests deterministic.
- Avoid unnecessary coupling between tests.

### Component Tests

- Prefer accessible queries.
- Test user behavior.
- Cover loading and error states.
- Verify important responsive and accessibility behavior.

### API Tests

- Mock network responses.
- Test both success and failure paths.
- Verify request parameters where important.
- Test authentication and retry behavior.

### E2E Tests

- Focus on high-value user journeys.
- Keep test data controlled.
- Avoid brittle selectors.
- Use stable test IDs when semantic selectors are insufficient.
- Run against a representative test or staging environment.

## 13. Summary

The frontend testing strategy combines unit, component, integration, API-mocking, and E2E testing. Critical workflows receive deeper coverage, while CI ensures regressions are detected before changes are merged.

# XIRV Systems Frontend Accessibility

**Project:** XIRV Systems – Enterprise Intelligence Platform  
**Document Version:** 1.0  
**Status:** Planned  
**Last Updated:** August 2026

---

## 1. Purpose

This document defines accessibility requirements and practices for the XIRV Systems frontend.

## 2. Accessibility Goals

The frontend should be:

- Inclusive by design.
- Keyboard accessible.
- Compatible with screen readers.
- Understandable without relying solely on color.
- Usable with appropriate zoom and text scaling.
- Designed toward WCAG 2.1 AA compliance.

## 3. WCAG Target

The project targets WCAG 2.1 Level AA. Level A provides the baseline; AA is the primary compliance target; AAA may be addressed where practical.

## 4. Keyboard Navigation

All interactive functionality must be usable with a keyboard.

Requirements include:

- Logical tab order.
- Visible focus indicators.
- Keyboard-accessible controls.
- Skip navigation where appropriate.
- No keyboard traps.
- Appropriate focus management for dialogs and overlays.

## 5. Screen Reader Support

Prefer semantic HTML before ARIA. Use ARIA when necessary for dialogs, live updates, loading/dynamic content, and controls lacking an accessible native name or state. Interactive elements must have meaningful accessible names and states.

## 6. Color and Contrast

The interface must not communicate essential information through color alone.

The original design guidance specifies:

| Content | Minimum Contrast |
|---|---:|
| Normal text | 4.5:1 |
| Large text | 3:1 |
| UI components | 3:1 |

Colors should be validated against the intended background and usage rather than relying only on palette definitions.

## 7. Semantic HTML

Use semantic elements such as:

- `main`
- `header`
- `nav`
- `section`
- `article`
- `footer`
- Appropriate heading levels
- Native form controls

Generic containers should not replace semantic elements when a suitable HTML element exists.

## 8. Forms

Forms should provide:

- Explicit labels.
- Clear instructions.
- Programmatically associated error messages.
- Visible validation feedback.
- Appropriate `aria-invalid` and descriptive relationships when required.
- Keyboard accessibility.

Errors should explain what needs to be corrected rather than only indicating that validation failed.

## 9. Images and Media

Images require meaningful alternative text when they convey information.

Decorative images should use an empty alternative where appropriate.

Media should:

- Provide appropriate controls.
- Avoid unexpected autoplay.
- Provide alternatives where necessary.
- Remain usable with keyboard and assistive technologies.

## 10. Motion

The interface should respect the user's reduced-motion preference.

Animations and transitions should be reduced or disabled when the operating system requests reduced motion.

Motion should not be required to understand or operate the application.

## 11. Accessibility Testing

Use automated and manual checks for keyboard navigation, screen readers, contrast, zoom/text scaling, focus behavior, forms, and dynamic announcements. Recommended tools include axe DevTools, WAVE, NVDA, VoiceOver, and a contrast checker. Automated checks supplement manual testing.

## 12. Release Checklist

Before release, verify:

- [ ] Interactive elements are keyboard accessible.
- [ ] Focus indicators are visible.
- [ ] Images have appropriate alternative text.
- [ ] Form labels are correctly associated.
- [ ] Error messages are accessible.
- [ ] Contrast requirements are satisfied.
- [ ] ARIA is used correctly and only where necessary.
- [ ] Page titles and headings are descriptive.
- [ ] Navigation has an appropriate skip mechanism where needed.
- [ ] Media does not autoplay unexpectedly.
- [ ] Reduced-motion preferences are respected.

## 13. Summary

Accessibility is a core frontend requirement. XIRV Systems should incorporate accessibility into component development, testing, and release review rather than treating it as a final-stage correction.