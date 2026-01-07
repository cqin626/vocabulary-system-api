# Vocabulary System API

A robust RESTful API powering a personalized language-learning ecosystem. This project combines the context-aware capabilities of Large Language Models (LLMs) with structured data management to help users master new terminology through a familiarity-tracking workflow.

### 🛠 Built With

Express, Prisma ORM, MySQL, TypeScript, OpenAI LLM

---

### 🚀 Key Features (v1.0.0)

#### **Admin Features**

1. Insert a term (word or phrase) along with its senses (meanings) and usage examples.
2. View all terms stored in the system.

#### **User Features**

1. Search for terms along with their definitions and examples.
2. Add or remove terms from a personal learning list.
3. Track familiarity with each term: `NEW` → `RECOGNIZED` → `FAMILIAR`.
4. Sort and filter items in the learning list to optimize study sessions.

---

### 🏗 Architecture Highlights

1. **Feature-based Controller-Service-Repository (CSR) pattern** for clean separation of concerns and maintainable code.
2. **JWT-based authentication and authorization**, enhanced with revocable refresh tokens for secure session management.
3. **AI-powered dynamic term generation** using OpenAI LLMs for terms not yet in the database. Future versions will integrate authoritative dictionary APIs while leveraging LLMs for contextual enrichment.
4. **Type-safe validation with Zod**, enforcing strict TypeScript-first schemas to ensure reliable request parsing and a robust codebase.
