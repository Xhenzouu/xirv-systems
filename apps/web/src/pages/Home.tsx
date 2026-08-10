import { useNavigate } from "react-router-dom"
import { ArrowRight, Zap, Shield, Database, Bot, FileText, BarChart3, Sparkles } from "lucide-react"
import "./Home.css"

function Home() {
  const navigate = useNavigate()

  const handleEnter = () => {
    navigate("/login")
  }

  const handleRegister = () => {
    navigate("/register")
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-nav-brand">
            <span className="landing-brand-text">XIRV</span>
            <span className="landing-brand-sub">Systems</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#tech">Tech Stack</a>
            <a href="#about">About</a>
            <button onClick={handleEnter} className="landing-nav-login">
              Sign In
            </button>
            <button onClick={handleRegister} className="landing-nav-register">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-container">
          <div className="landing-hero-badge">
            <Sparkles size={16} />
            AI-Powered Intelligence Platform
          </div>
          <h1 className="landing-hero-title">
            Enterprise Intelligence <br />
            <span className="landing-hero-highlight">At Your Fingertips</span>
          </h1>
          <p className="landing-hero-description">
            XIRV Systems combines knowledge management, AI-powered chat, and 
            intelligent automation into a single, seamless platform.
          </p>
          <div className="landing-hero-actions">
            <button onClick={handleEnter} className="landing-hero-primary">
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button onClick={handleRegister} className="landing-hero-secondary">
              Create Account
            </button>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-number">100%</span>
              <span className="landing-hero-stat-label">Open Source</span>
            </div>
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-number">24/7</span>
              <span className="landing-hero-stat-label">AI Available</span>
            </div>
            <div className="landing-hero-stat">
              <span className="landing-hero-stat-number">100%</span>
              <span className="landing-hero-stat-label">Privacy First</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="landing-features-container">
          <div className="landing-features-header">
            <span className="landing-features-badge">Features</span>
            <h2 className="landing-features-title">
              Everything you need to manage <br />and leverage your knowledge
            </h2>
          </div>
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon" style={{ background: '#e0f2fe' }}>
                <FileText size={24} color="#0284c7" />
              </div>
              <h3>Knowledge Management</h3>
              <p>Upload, organize, and search documents with categories, tags, and version control.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon" style={{ background: '#fae8ff' }}>
                <Bot size={24} color="#9333ea" />
              </div>
              <h3>AI Intelligence</h3>
              <p>Chat with your documents using RAG-powered AI with source attribution.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon" style={{ background: '#d1fae5' }}>
                <Zap size={24} color="#059669" />
              </div>
              <h3>Real-time Chat</h3>
              <p>Streaming responses with contextual understanding of your knowledge base.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon" style={{ background: '#fef3c7' }}>
                <Shield size={24} color="#d97706" />
              </div>
              <h3>Enterprise Security</h3>
              <p>JWT authentication, RBAC, audit logging, and rate limiting built-in.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon" style={{ background: '#dbeafe' }}>
                <Database size={24} color="#2563eb" />
              </div>
              <h3>Vector Search</h3>
              <p>Semantic search with pgvector for intelligent document retrieval.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon" style={{ background: '#fce4ec' }}>
                <BarChart3 size={24} color="#dc2626" />
              </div>
              <h3>Analytics & Insights</h3>
              <p>Track usage, document activity, and AI query performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="landing-tech">
        <div className="landing-tech-container">
          <h2 className="landing-tech-title">Modern Technology Stack</h2>
          <p className="landing-tech-description">
            Built with production-grade tools and frameworks
          </p>
          <div className="landing-tech-grid">
            <div className="landing-tech-item">
              <span className="landing-tech-name">React</span>
              <span className="landing-tech-desc">UI Framework</span>
            </div>
            <div className="landing-tech-item">
              <span className="landing-tech-name">TypeScript</span>
              <span className="landing-tech-desc">Type Safety</span>
            </div>
            <div className="landing-tech-item">
              <span className="landing-tech-name">Node.js</span>
              <span className="landing-tech-desc">Runtime</span>
            </div>
            <div className="landing-tech-item">
              <span className="landing-tech-name">PostgreSQL</span>
              <span className="landing-tech-desc">Database</span>
            </div>
            <div className="landing-tech-item">
              <span className="landing-tech-name">Prisma</span>
              <span className="landing-tech-desc">ORM</span>
            </div>
            <div className="landing-tech-item">
              <span className="landing-tech-name">Ollama</span>
              <span className="landing-tech-desc">AI Inference</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="landing-cta">
        <div className="landing-cta-container">
          <h2 className="landing-cta-title">Ready to get started?</h2>
          <p className="landing-cta-description">
            Join the future of enterprise intelligence. Open source, self-hosted, and built for scale.
          </p>
          <div className="landing-cta-actions">
            <button onClick={handleRegister} className="landing-cta-primary">
              Create Free Account
              <ArrowRight size={20} />
            </button>
            <button onClick={handleEnter} className="landing-cta-secondary">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <p>© 2026 XIRV Systems. Built with ❤️ by Henson Brix Arroyo</p>
          <div className="landing-footer-links">
            <a href="https://github.com/Xhenzouu/xirv-systems" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#features">Features</a>
            <a href="#tech">Tech Stack</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home