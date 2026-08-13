# XIRV Systems

**Enterprise Intelligence Platform** — A full-stack AI-powered knowledge management system.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis)](https://redis.io/)
[![AWS](https://img.shields.io/badge/AWS-EC2%2C%20RDS%2C%20S3-FF9900?logo=amazon-aws)](https://aws.amazon.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

### Backend

- ✅ **Authentication** — JWT with refresh token rotation
- ✅ **RBAC** — USER, ADMIN, SUPER_ADMIN roles
- ✅ **Knowledge Management** — Document upload, search, categories, tags
- ✅ **AI Gateway** — Provider abstraction (OpenAI, Ollama, Anthropic)
- ✅ **RAG** — Retrieval-Augmented Generation with pgvector
- ✅ **Workflow Automation** — Create and execute workflows with task management and approvals
- ✅ **Caching** — Redis-powered caching for improved performance
- ✅ **Audit Logging** — Complete action tracking
- ✅ **Rate Limiting** — API protection
- ✅ **Testing** — 52+ tests with Vitest

### Frontend

- ✅ **Dashboard** — System overview and metrics
- ✅ **Knowledge Base** — Document management UI
- ✅ **AI Intelligence** — RAG-powered chat with sources
- ✅ **Workflows** — Workflow management and task board UI
- ✅ **Analytics** — Charts and usage metrics
- ✅ **Settings** — Profile, password, account management

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | API server |
| **TypeScript** | Type-safe JavaScript |
| **PostgreSQL + Prisma** | Database and ORM |
| **Redis** | Caching and rate limiting |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Zod** | Validation |
| **Pino** | Logging |
| **Vitest** | Testing |
| **pnpm + TurboRepo** | Monorepo management |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React + TypeScript** | UI framework |
| **Vite** | Build tool |
| **React Router** | Navigation |
| **Recharts** | Charts |
| **Lucide React** | Icons |

### AI

| Technology | Purpose |
|------------|---------|
| **Ollama** | Local LLM inference |
| **OpenAI** | Cloud LLM (optional) |
| **pgvector** | Vector search |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **AWS EC2** | Application hosting |
| **AWS RDS** | PostgreSQL database |
| **AWS S3** | Frontend hosting |
| **Redis** | In-memory caching |

---

## 📁 Project Structure

```text
xirv-systems/
├── apps/
│   └── web/                         # React Frontend
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── layouts/
│       │   ├── context/
│       │   ├── hooks/
│       │   └── styles/
│       └── package.json
├── services/
│   ├── api/                         # Backend API
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   ├── tests/
│   │   ├── prisma/
│   │   └── package.json
│   └── ai-gateway/                  # AI Provider Abstraction
├── docs/                            # Documentation
├── .github/
│   └── workflows/                   # CI/CD
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22+
- **PostgreSQL** 16+
- **Redis** 7+
- **Ollama** (for local AI)
- **pnpm** 8+

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Xhenzouu/xirv-systems.git
cd xirv-systems
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp services/api/.env.example services/api/.env
cp apps/web/.env.example apps/web/.env
```

4. **Set up the database**

```bash
cd services/api
npx prisma migrate deploy
```

5. **Start Redis (if using locally)**

```bash
redis-server
```

6. **Start the backend**

```bash
cd services/api
pnpm run dev
```

7. **Start the frontend**

```bash
cd apps/web
pnpm run dev
```

8. **Start Ollama**

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
ollama serve
```

9. **Open the app**

```text
http://localhost:5173
```

---

## 🧪 Testing

```bash
cd services/api
pnpm test
```

---

## 📚 Documentation

Full documentation is available in the `docs/` directory:

- **Backend**: Architecture, API, Database, Security, Conventions, Roadmap
- **Frontend**: Architecture, Components, Routing, State, User Guide

### API Documentation

Once the server is running:

```text
http://localhost:3000/api/docs
```

---

## 🚀 Deployment

The platform is deployed on AWS:

| Component | Service |
|-----------|---------|
| **Backend** | AWS EC2 with PM2 |
| **Database** | AWS RDS (PostgreSQL) |
| **Frontend** | AWS S3 (Static Hosting) |
| **Caching** | Redis (EC2 or ElastiCache) |

### Live URL

```text
http://xirv-frontend.s3-website-ap-southeast-2.amazonaws.com
```

---

## 🤝 Contributing

This is a personal portfolio project, but issues and suggestions are welcome!

---

## 📄 License

MIT © [Henson Brix A. Arroyo](https://github.com/Xhenzouu)

---

## 📬 Contact

- **Portfolio**: [hensonbrix-portfolio.vercel.app](https://hensonbrix-portfolio.vercel.app/)
- **GitHub**: [github.com/Xhenzouu](https://github.com/Xhenzouu)
- **Email**: arroyobrix@gmail.com