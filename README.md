# XIRV Systems

**Enterprise Intelligence Platform** — A full-stack AI-powered knowledge management system.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

### Backend
- ✅ **Authentication** — JWT with refresh token rotation
- ✅ **RBAC** — USER, ADMIN, SUPER_ADMIN roles
- ✅ **Knowledge Management** — Document upload, search, categories, tags
- ✅ **AI Gateway** — Provider abstraction (OpenAI, Ollama, Anthropic)
- ✅ **RAG** — Retrieval-Augmented Generation with pgvector
- ✅ **Audit Logging** — Complete action tracking
- ✅ **Rate Limiting** — API protection
- ✅ **Testing** — 49+ tests with Vitest

### Frontend
- ✅ **Dashboard** — System overview and metrics
- ✅ **Knowledge Base** — Document management UI
- ✅ **AI Intelligence** — RAG-powered chat with sources
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

---

## 📁 Project Structure

```
xirv-systems/
├── services/
│   ├── api/                 # Backend API
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
│   └── ai-gateway/          # AI Provider Abstraction
├── apps/
│   └── web/                 # React Frontend
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── layouts/
│       │   ├── context/
│       │   ├── hooks/
│       │   └── styles/
│       └── package.json
├── docs/                    # Documentation
├── .github/
│   └── workflows/           # CI/CD
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22+
- **PostgreSQL** 16+
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

5. **Start the backend**
```bash
cd services/api
pnpm run dev
```

6. **Start the frontend**
```bash
cd apps/web
pnpm run dev
```

7. **Start Ollama**
```bash
ollama pull llama3.2
ollama pull nomic-embed-text
ollama serve
```

8. **Open the app**
```
http://localhost:5173
```

---

## 🧪 Testing

```bash
cd services/api
pnpm test
```

---

## 📚 API Documentation

Once the server is running:
```
http://localhost:3000/api/docs
```

---

## 🤝 Contributing

This is a personal portfolio project, but issues and suggestions are welcome!

---

## 📄 License

MIT © [Henson Brix A. Arroyo](https://github.com/Xhenzouu)

---

## 📬 Contact

- **Portfolio**: [hensonbrix-portfolio.vercel.app](https://hensonbrix-portfolio.vercel.app)
- **GitHub**: [github.com/Xhenzouu](https://github.com/Xhenzouu)
- **Email**: arroyobrix@gmail.com