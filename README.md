# Small Business E-Commerce Platform

A comprehensive white-label platform for hosting providers to offer e-commerce solutions to small businesses. Provide server infrastructure, domain management, and a powerful website builder to your clients.

## 🚀 Key Features

### Hosting Provider Dashboard (Admin)
- **Infrastructure Management**: Provision and monitor server nodes (VPS, Dedicated, etc.).
- **Store Management**: Create, list, and manage client stores.
- **Multi-Tenancy**: Isolated environments for each store owner.
- **Provider Analytics**: Overview of platform usage.

### Business Owner Portal (Client)
- **Website Builder**: Visual drag-and-drop editor based on GrapesJS.
- **Product Management**: Add products, manage inventory and pricing.
- **Order Management**: Track orders from creation to fulfillment.
- **Payments**: Integrated payment processing (Simulated Stripe).
- **Page Management**: Create and manage custom pages.

### Backend Infrastructure
- **API**: Robust RESTful API built with Node.js, Express, and TypeScript.
- **Database**: PostgreSQL with Prisma ORM for type-safe database access.
- **Caching**: Redis for high-performance data retrieval.
- **File Storage**: Local file upload system (Multer) with static serving.
- **Authentication**: Secure JWT-based authentication with Role-Based Access Control (RBAC).

## 🛠️ Tech Stack

- **Monorepo**: Managed with NPM Workspaces.
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis.
- **Hosting Dashboard**: React, Vite, TailwindCSS.
- **Business Portal**: Next.js (App Router), TailwindCSS.
- **DevOps**: Docker for local database and cache services.

## 📦 Prerequisites

- **Node.js**: v18+
- **Docker**: For running PostgreSQL and Redis.

## ⚡ Quick Start

### 1. Installation

Install dependencies for all workspaces:
```bash
npm install
```

### 2. Environment Setup

Start the database services:
```bash
docker-compose up -d
```

Generate Prisma Client and apply migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Run the Application

We have provided a helper script to launch all services simultaneously (Backend, Hosting Dashboard, Business Portal):

**Windows (PowerShell):**
```powershell
./run-all.ps1
```

Or run services individually:

**Backend (Port 3001):**
```bash
cd apps/backend
npm start
```

**Hosting Dashboard (Port 5173):**
```bash
cd apps/hosting-dashboard
npm run dev
```

**Business Portal (Port 3000):**
```bash
cd apps/business-portal
npm run dev
```

## 🧪 Verification & Testing

To verify the backend API integrity, run the verification script:
```bash
cd apps/backend
npx ts-node verify-all.ts
```

## 📝 User Flows

1.  **Provider Flow**: Login to Hosting Dashboard -> Create Store -> Manage Infrastructure.
2.  **Owner Flow**: Login to Business Portal -> Add Products -> Build Website -> Accept Orders.

## 📂 Project Structure

```
├── apps
│   ├── backend             # Node.js/Express API
│   ├── business-portal     # Next.js App for Store Owners
│   └── hosting-dashboard   # React/Vite App for Providers
├── packages                # Shared libraries (if any)
└── docker-compose.yml      # Infrastructure services
```
