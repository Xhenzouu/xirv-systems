# XIRV Systems Documentation

**Project:** XIRV Systems – Enterprise Intelligence Platform
**Status:** Active Development
**Documentation Version:** 1.2
**Last Updated:** August 2026

---

## Welcome

Welcome to the XIRV Systems documentation.

This directory contains the project's engineering knowledge base and serves as the primary reference for architecture, backend development, frontend development, engineering standards, security, deployment planning, and future platform evolution.

The goal of this documentation is to make the project understandable, maintainable, and scalable over time.

Documentation is treated as part of the product rather than an afterthought.

---

## Documentation Philosophy

The XIRV Systems documentation is built around several principles:

- Documentation should explain *why*, not only *what*.
- Architecture decisions should be recorded.
- Engineering standards should remain consistent.
- Security should be documented alongside implementation.
- Documentation should evolve with the codebase.

When code changes significantly, the corresponding documentation should be updated.

---

## Documentation Structure

```text
docs/
│
├── README.md
│
├── backend/
│   ├── backend-roadmap.md
│   ├── backend-architecture.md
│   ├── backend-conventions.md
│   ├── backend-changelog.md
│   ├── backend-database.md
│   ├── backend-api.md
│   ├── backend-security.md
│   ├── backend-backlog.md
│   └── production-checklist.md
│
├── frontend/
│   ├── frontend-api-integration.md
│   ├── frontend-architecture.md
│   ├── frontend-changelog.md
│   ├── frontend-contributing.md
│   ├── frontend-deployment.md
│   ├── frontend-faq.md
│   ├── frontend-roadmap.md
│   └── frontend-user-guide.md
│
├── ai/
│   └── (planned)
│
├── deployment/
│   └── (planned)
│
├── infrastructure/
│   └── (planned)
│
├── adr/
│   └── (planned)
│
├── diagrams/
│   └── (planned)
│
└── assets/
````

---

## Project Overview

### What is XIRV Systems?

XIRV Systems is an enterprise intelligence platform designed to help organizations manage their knowledge and leverage artificial intelligence. It combines document management, AI-powered search, and Retrieval-Augmented Generation (RAG) into a single, cohesive platform.

### Key Features

| Feature | Description |                                                                          |
| ---------------------- | ------------------------------------------------------------------------ |
| Knowledge Management   | Upload, organize, search, and manage documents with categories and tags  |
| AI Intelligence        | Conversational AI powered by Ollama with RAG support                     |
| RAG Pipeline           | Semantic search with pgvector, document chunking, and source attribution |
| Authentication         | JWT with refresh token rotation and RBAC (USER, ADMIN, SUPER\_ADMIN)     |
| Workflow Automation    | Create and execute workflows with task management and approval flows     |
| Analytics              | Usage metrics, document statistics, and activity charts                  |
| Audit Logging          | Complete audit trail of user actions                                     |
| API Documentation      | Swagger/OpenAPI interactive documentation                                |
| Caching                | Redis-powered caching for improved performance and reduced database load |

---

## Tech Stack

### Backend

| Technology | Purpose |                           |
| --------------------- | ------------------------- |
| Node.js + Express     | API server                |
| TypeScript            | Type-safe JavaScript      |
| PostgreSQL + Prisma   | Database and ORM          |
| Redis                 | Caching and rate limiting |
| JWT                   | Authentication            |
| bcrypt                | Password hashing          |
| Zod                   | Validation                |
| Pino                  | Logging                   |
| Vitest                | Testing                   |
| pnpm + TurboRepo      | Monorepo management       |

### Frontend

| Technology | Purpose |              |
| --------------------- | ------------ |
| React + TypeScript    | UI framework |
| Vite                  | Build tool   |
| React Router          | Navigation   |
| Recharts              | Charts       |
| Lucide React          | Icons        |

### AI

| Technology | Purpose |                      |
| --------------------- | -------------------- |
| Ollama                | Local LLM inference  |
| OpenAI                | Cloud LLM (optional) |
| pgvector              | Vector search        |

### Infrastructure

| Technology | Purpose |                     |
| --------------------- | ------------------- |
| AWS EC2               | Application hosting |
| AWS RDS               | PostgreSQL database |
| AWS S3                | Frontend hosting    |
| Redis                 | In-memory caching   |

---

## Project Status

| Phase | Status | Completion |            |                      |
| ------------------------- | ---------- | ---------- |
| Backend Foundation        | ✅ Complete | 100%                 |
| Production Hardening      | ✅ Complete | 100%                 |
| Developer Experience      | ✅ Complete | 90% (Docker pending) |
| Knowledge Management      | ✅ Complete | 100%                 |
| AI Gateway                | ✅ Complete | 100%                 |
| RAG                       | ✅ Complete | 100%                 |
| Frontend                  | ✅ Complete | 100%                 |
| Workflow Automation       | ✅ Complete | 100%                 |
| Redis Caching             | ✅ Complete | 100%                 |
| Organizations & Teams     | ⏳ Planned  | 0%                   |
| Production Deployment     | ⏳ Planned  | 0%                   |

---

## Backend Documentation

The backend documentation defines the current implementation of the XIRV API and supporting infrastructure.

| **FileDescription**       |                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend-roadmap.md`      | Describes the planned evolution of the backend and major milestones                                                                             |
| `backend-architecture.md` | Explains the layered architecture, module organization, and system design                                                                       |
| `backend-conventions.md`  | Defines coding standards, folder structure, naming conventions, and development practices                                                       |
| `backend-changelog.md`    | Records completed engineering work and significant architectural changes                                                                        |
| `backend-database.md`     | Documents the PostgreSQL schema, Prisma models, relationships, migration strategy, and database conventions                                     |
| `backend-api.md`          | Defines the REST API contract, endpoints, request and response formats, authorization requirements, and business rules                          |
| `backend-security.md`     | Describes the platform's security architecture, authentication model, authorization strategy, production hardening, and future security roadmap |
| `backend-backlog.md`      | Tracks technical debt, future improvements, research topics, and engineering tasks not yet scheduled                                            |
| `production-checklist.md` | Production deployment checklist for the backend                                                                                                 |

---

## Frontend Documentation

The frontend documentation defines the current implementation of the XIRV Systems user interface.

| File | Description |                                                                            |
| ----------------------------- | -------------------------------------------------------------------------- |
| `frontend-api-integration.md` | API communication, services, and data fetching patterns                    |
| `frontend-architecture.md`    | Frontend architecture overview, component hierarchy, and design principles |
| `frontend-changelog.md`       | Historical changes and version history of the frontend                     |
| `frontend-contributing.md`    | Contributing guidelines for frontend development                           |
| `frontend-deployment.md`      | Deployment process, infrastructure, and CI/CD pipeline                     |
| `frontend-faq.md`             | Frequently asked questions about the frontend                              |
| `frontend-roadmap.md`         | Frontend development roadmap and milestones                                |
| `frontend-user-guide.md`      | User guide for the frontend application                                    |

---

## Redis Integration

Redis provides the platform's in-memory caching layer to improve API response times and reduce database load.

The integration uses endpoint-specific cache keys, defined TTLs, and cache invalidation after relevant write operations. Detailed cache policies and implementation behavior should be maintained in the backend Redis/caching documentation rather than duplicated in this project index.

## Planned Documentation

As the project evolves, additional documentation areas will be introduced.

### AI

Future topics:

- AI Gateway
- Prompt engineering
- Retrieval-Augmented Generation (RAG)
- Embeddings
- Knowledge Base
- Model integrations
- AI architecture

### Deployment

Future topics:

- Docker
- Docker Compose
- Nginx
- Reverse proxy
- CI/CD
- Production deployment
- Environment management

### Infrastructure

Future topics:

- Cloud architecture
- Networking
- Monitoring
- Logging
- Backups
- Disaster recovery

### Architecture Decision Records (ADR)

Major architectural decisions should be recorded as Architecture Decision Records.

Each ADR should explain:

- Context
- Decision
- Alternatives considered
- Consequences

This preserves important engineering knowledge over time.

### Diagrams

Future visual documentation may include:

- System architecture
- Authentication flow
- Database relationships
- Deployment topology
- Request lifecycle
- Service interactions

---

## Recommended Reading Order

For new contributors:

1. Repository `README.md`
2. `docs/README.md`
3. Backend Architecture
4. Frontend Architecture
5. Backend Engineering Conventions
6. Backend Database
7. Backend API
8. Backend Security
9. Backend Roadmap
10. Backend Backlog
11. Backend Changelog

This order introduces the project from high-level concepts to implementation details.

---

## Documentation Maintenance

Documentation should be updated whenever:

- New features are introduced.
- API contracts change.
- Database schema changes.
- Security mechanisms change.
- Architectural decisions are made.
- Development conventions evolve.
- Infrastructure changes (e.g., Redis integration).

Documentation should remain synchronized with the codebase.

---

## Contribution Guidelines

When contributing to XIRV Systems:

- Follow the documented engineering conventions.
- Preserve architectural consistency.
- Update documentation alongside implementation.
- Record significant changes in the changelog.
- Add backlog items for future improvements rather than leaving undocumented notes.

---

## Long-Term Vision

The documentation is expected to grow alongside the platform.

Future additions may include:

- AI engineering handbook
- Deployment guide
- Infrastructure guide
- Operations runbooks
- Troubleshooting playbooks
- Performance tuning guide
- Security operations manual
- Testing handbook
- Release management guide

The objective is to build a comprehensive engineering knowledge base that supports long-term development and collaboration.

---

## Summary

The XIRV Systems documentation serves as the central source of engineering knowledge for the project. It provides guidance on architecture, development standards, security, database design, API behavior, frontend development, and future planning. By maintaining accurate and up-to-date documentation, the project remains understandable, scalable, and maintainable as it evolves from an academic project into an enterprise-grade intelligence platform.