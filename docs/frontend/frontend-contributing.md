# XIRV Systems Frontend Contributing Guide

**Project:** XIRV Systems – Enterprise Intelligence Platform  
**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** August 2026

---

## 1. Purpose

This document defines how contributors should set up, develop, test, review, document, and submit changes to the XIRV Systems frontend.

## 2. Getting Started

### Prerequisites

- Node.js 22+
- pnpm 8+
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React and TypeScript

### Setup

1. Fork the repository.
2. Clone the fork locally.
3. Install dependencies with `pnpm install`.
4. Start the development server with `pnpm run dev`.

## 3. Development Workflow

### Feature Development

1. Create a branch from `main`.
2. Implement the change.
3. Write or update tests.
4. Update relevant documentation.
5. Submit a pull request.

### Branch Naming

- `feature/feature-name`
- `fix/bug-name`
- `docs/documentation-name`
- `refactor/refactor-name`

### Commit Messages

Use clear, descriptive, imperative messages and reference related issues when applicable.

## 4. Code Standards

### TypeScript

- Strict mode is required.
- Avoid `any`.
- Use explicit, meaningful types.
- Prefer named imports.
- Use ES Modules.

### React

- Prefer functional components.
- Use hooks for state and effects.
- Use memoization only where it provides a measurable benefit.
- Manage side effects explicitly and correctly.

### CSS

- Use the `xirv-` prefix for class names.
- Use CSS variables for theming.
- Keep styles scoped to their relevant components or features.

## 5. Testing

### Test Types

- Unit tests for utilities and hooks.
- Component tests for UI components.
- Integration tests for features.
- End-to-end tests for critical user flows.

### Running Tests

```bash
pnpm test
pnpm test:coverage
```

Tests should be deterministic and should cover important loading, error, empty, and edge states.

## 6. Documentation

Document:

- New components.
- New features.
- Changed behavior.
- API changes.
- Significant architectural changes.

Relevant documentation locations include:

- `docs/frontend/frontend-components.md`
- `docs/frontend/frontend-api-integration.md`
- `docs/frontend/frontend-architecture.md`

Documentation should be updated alongside the change rather than after the implementation has been completed.

## 7. Code Review

### Review Criteria

Reviewers should consider:

- Code quality and maintainability.
- TypeScript correctness.
- Performance.
- Accessibility.
- Security.
- Test coverage.
- Documentation.
- Consistency with project conventions.

### Review Process

1. Submit the pull request.
2. Automated checks run.
3. Review feedback is addressed.
4. Required changes are completed.
5. The pull request is approved and merged.

## 8. Design Principles

### Component Design

Components should be:

- Single-purpose.
- Reusable where appropriate.
- Testable.
- Documented when their behavior or API warrants it.

### Performance

- Avoid unnecessary renders.
- Keep bundles reasonably sized.
- Use code splitting for appropriate features.
- Lazy-load expensive or non-critical functionality where appropriate.

### Accessibility

- Use semantic HTML.
- Support keyboard navigation.
- Provide screen-reader-compatible interfaces.
- Maintain appropriate color contrast and visible focus states.

## 9. Commit Guidelines

### Commit Message Format

Use:

```text
type: subject

body (optional)

footer (optional)
```

### Commit Types

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Code style
- `refactor` — Code refactoring
- `perf` — Performance improvement
- `test` — Testing
- `chore` — Maintenance

## 10. Pull Request Guidelines

### Before Submitting

Confirm that:

- All relevant tests pass.
- TypeScript compiles successfully.
- Linting passes.
- Documentation has been updated.
- There are no unresolved merge conflicts.

### PR Description

Include:

- What changed.
- Why it changed.
- Related issues or references.
- Any relevant implementation or testing notes.

## 11. Communication and Issue Reporting

### Channels

- GitHub Issues
- GitHub Discussions
- Pull request comments

### Reporting Issues

Before opening an issue:

1. Check existing issues.
2. Provide clear reproduction steps.
3. Include screenshots when useful.
4. Include relevant environment and version information.
5. Describe the expected and actual behavior.

## 12. Code of Conduct

Contributors are expected to:

- Be respectful.
- Be collaborative.
- Provide constructive feedback.
- Maintain an inclusive development environment.

## 13. Summary

Following this guide keeps frontend contributions consistent, reviewable, testable, and maintainable.

---

# XIRV Systems Frontend Standards

**Project:** XIRV Systems – Enterprise Intelligence Platform  
**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** August 2026

---

## 1. Purpose

This document defines the quality standards for the XIRV Systems frontend.

## 2. Code Quality Standards

### TypeScript

- Strict mode enabled.
- Avoid `any`.
- Use explicit return types where they improve clarity.
- Handle errors appropriately.
- Maintain comprehensive type definitions.

### ESLint

ESLint should enforce consistent code quality, including:

- No unused variables.
- Appropriate handling of console output.
- Consistent import organization.
- Correct hook dependencies.
- Accessibility checks.

## 3. Performance Standards

### Web Performance

The project should target:

- First Contentful Paint (FCP): under 1.5 seconds.
- Largest Contentful Paint (LCP): under 2.5 seconds.
- Cumulative Layout Shift (CLS): under 0.1.
- Interaction to Next Paint (INP): under 200 ms.

The original specification referenced FID; INP is the current interaction metric to use for ongoing performance evaluation.

### Bundle Size

Target budgets:

- Initial bundle: under 200 KB gzipped.
- Total bundle: under 500 KB gzipped.
- Individual route: under 100 KB gzipped where practical.

These are performance budgets rather than absolute guarantees and should be reviewed as the application evolves.

### Rendering

- Avoid unnecessary re-renders.
- Use memoization where justified.
- Virtualize large datasets when rendering volume requires it.

## 4. Accessibility Standards

### WCAG Compliance

Target WCAG 2.1 AA.

The frontend should support:

- Keyboard navigation.
- Screen readers.
- Appropriate color contrast.
- Visible focus indicators.
- Semantic HTML.
- Appropriate ARIA usage.
- Skip navigation where required.

## 5. Testing Standards

### Coverage Targets

- Unit tests: 80%+
- Component tests: 80%+
- Integration tests: 70%+
- E2E tests: critical user flows

Coverage targets should guide quality measurement but should not replace meaningful behavioral testing.

### Test Types

- Unit tests for utilities and isolated logic.
- Component tests for UI behavior.
- Integration tests for feature interactions.
- E2E tests for critical workflows.

## 6. Documentation Standards

### Component Documentation

Document, where applicable:

- Component purpose.
- Props and types.
- Usage.
- Accessibility considerations.

### Code Comments

Comments should explain:

- Complex logic.
- Non-obvious technical decisions.
- Important constraints.
- TODOs that require future work.

Avoid comments that merely restate obvious code.

## 7. Performance Budgets

| Metric | Budget |
|---|---:|
| Initial load | < 2 s |
| Time to Interactive | < 3 s |
| Bundle size | < 500 KB |
| API response | < 200 ms |

These budgets should be treated as engineering targets and interpreted alongside real-world network and deployment conditions.

## 8. Security Standards

### Authentication

- Use JWT-based authentication as defined by the application architecture.
- Refresh authentication when required by the API.
- Provide secure logout behavior.
- Never expose authentication credentials unnecessarily.

### Data

- Do not store sensitive data in client-side storage without a documented security reason.
- Validate user-controlled data.
- Use secure API communication.

### XSS Prevention

- Rely on React's default escaping.
- Avoid dangerous HTML injection.
- Sanitize user-controlled HTML when HTML rendering is genuinely required.

## 9. Browser Support

### Supported Browsers

| Browser | Minimum Version |
|---|---:|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |

### Mobile Support

- Responsive layouts.
- Touch-friendly interactions.
- Mobile navigation.
- Appropriate viewport behavior.

## 10. Code Review Standards

Review changes for:

- Code quality.
- Performance.
- Accessibility.
- Security.
- Documentation.
- Testing.
- Consistency with project conventions.

The review process should include automated checks, manual review, feedback resolution, and approval before merge.

## 11. Release Standards

### Pre-Release

- All required tests pass.
- TypeScript compiles.
- Production build succeeds.
- Documentation is updated.
- Changelog is updated where applicable.

### Release

- Version is updated where required.
- Release tag is created where applicable.
- Deployment is verified.
- Health checks pass.

## 12. Summary

These standards establish the expected quality baseline for XIRV Systems frontend contributions and releases. Changes should satisfy the relevant code quality, performance, accessibility, testing, documentation, security, and release requirements before merging or deployment.