# Juris AI ⚖️
**AI-Powered Legal Contract Analysis for the Indian Framework**

Juris AI is a state-of-the-art legal technology platform designed to help users identify risks, extract critical clauses, and verify Indian law compliance in seconds. By leveraging a multi-agent AI orchestrated pipeline, Juris AI simplifies complex legal jargon into understandable insights and vernacular translations.

## 💡The Idea
Legal documents are often opaque and filled with "silent risks." Juris AI empowers entrepreneurs, individuals, and legal professionals by:
- **Identifying High-Risk Clauses**: Automated scoring of unfair terms.
- **Indian Law Context**: Verifying compliance against Indian Acts (e.g., Information Technology Act, Indian Contract Act).
- **Vernacular Accessibility**: Translating complex legal risks into simple summaries in languages like Hindi, Marathi, Tamil, and more.
- **Analysis History**: Securely storing and retrieving past document reports.

## 🛠️ Technology Stack
- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **UI/Animations**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [Shadcn UI](https://ui.shadcn.com/)
- **AI Intelligence**: [OpenAI API](https://openai.com/) (Multi-Agent Orchestration: Reader, Scorer, Extractor, Translator)
- **Database & Storage**: [Supabase](https://supabase.com/) (JSONB Storage for Reports)
- **Security**: 
  - **AES-256-GCM**: Military-grade encryption at rest for data.
  - **TLS 1.3 / HSTS**: Hardened transit security and headers.
- **Parsing**: `@cedrugs/pdf-parse` (PDF), `mammoth` (DOCX)

## 🏗️ Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase Account
- OpenAI API Key

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_key
AUTH_SECRET=your_auth_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Installation
```bash
npm install
npm run dev
```

## 🖥️ Product Demo
*Video* - 

*Link* - https://juris-ai-model.vercel.app

---
Crafted with ❤️ at CodeLite Hackathon for India’s Legal Revolution.
