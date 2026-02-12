# Tandem Backend API

Backend service for the **Tandem** application (RS School Final Project).
This server implements the **API Service Layer** architecture, handles AI Agent integration via Groq, and enforces strict code quality standards.

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript (Strict Mode)
* **AI Provider:** Groq SDK
* **Documentation:** Swagger / OpenAPI
* **Code Quality:** Biome (Formatting), ESLint (Linting), Husky (Git Hooks)

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18.x or higher) installed.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone <https://github.com/rss-mentoring-ansiv/fe-course-2025Q3-final-backend.git>
cd fe-course-2025q3-final-backend
npm install
```

## 🏃‍♂️ Running the Server

**Development Mode**
Starts the server with hot-reloading using tsx.

```bash
npm run dev
```

Once started, the server will be available at:
* **API Root:** `http://localhost:3000`
* **Swagger Docs:** `http://localhost:3000/api-docs`
