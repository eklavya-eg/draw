# 🎨 Draw

**Draw** is a drawing app where multiple users can join a shared canvas and draw in real time. Built with Next.js, WebSockets, and PostgreSQL, this project demonstrates a modern full-stack setup for real-time applications.

---

## 🚀 Demo

🎥 [Watch the demo video](https://drive.google.com/file/d/1TmVnLB0pDgSYsUOS2VprCU-FzkG7Bunp/view?usp=sharing)

---

## 🛠️ Tech Stack

- **Express + WS** – WebSocket server & HTTP server (in `apps/ws`)
- **Next.js + Tanstack** – Client server & State Management (in `apps/next`)
- **Prisma + PostgreSQL** – Database and ORM
- **Docker** – For running the database
- **Turborepo + PNPM** – Monorepo management

---

## ⚙️ Setup Guide

### 1. Clone the repository

```bash
git clone https://github.com/eklavya-eg/draw.git
```
```bash
cd draw
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Start PostgreSQL with Docker
```bash
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -v draw_postgres_data:/var/lib/postgresql/data \
  -d postgres
```
### 4. Create the .env file
#### Create a .env file inside packages/db/
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"
```
### 5. Run the app
```bash
pnpm run dev
```

---

## 📌 Features

- 👥 **Multi-user real-time drawing**
- 📡 **WebSocket-based low-latency communication**
- 💾 **Persistent storage with PostgreSQL + Prisma**

---

## 📁 Project Structure
```
draw/
├── .github/
│ └── workflows/
│ └── vercel.yml
├── .vscode/
│ └── settings.json
├── apps/
│ ├── draw-client/
│ └── ws-server/
├── packages/
│ ├── common/
│ ├── db/
│ │ ├── .env
│ │ └── prisma/
│ │   └── schema.prisma
│ ├── eslint-config/
│ ├── typescript-config/
│ └── ui/
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tailwind.config.ts
└── turbo.json
```
