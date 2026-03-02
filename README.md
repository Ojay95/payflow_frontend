# 💸 PayFlow: Enterprise Payroll Command Center

**PayFlow** is a high-fidelity, production-ready payroll management system built with **React**, **TypeScript**, and **Tailwind CSS**. It is architected to interface with a Go-based backend to provide secure, real-time disbursements through **VFD Bank** and **Korapay** integrations.

---

## 🏗 Architectural Overview

The application follows a **Modular Service-Oriented Architecture** designed for financial integrity and security.

* **State Management**: Powered by `Zustand` with persistent storage for session maintenance.
* **Security Model**: A strict **Two-Gate Authentication** system (JWT + TOTP 2FA).
* **Financial Math**: Implements a **Zero-Float Policy**, utilizing cent-integers (int64) for all calculations to prevent rounding errors.
* **API Layer**: Centralized interceptor pattern with global loading states and automatic session expiration handling.

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend Framework** | React 18 (Vite) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS (JIT Engine) |
| **State** | Zustand + Middleware |
| **Routing** | React Router v6 (Hash Mode) |
| **Icons** | Google Material Symbols |

---

## 📂 Project Structure

```bash
src/
├── api/            # Centralized API modules (Wallets, Payroll, VFD)
├── components/     # High-density UI components (Layout, Sidebar, Toast)
├── hooks/          # Reusable business logic (usePayroll, useAuth)
├── pages/          # Full-page views (Dashboard, Workforce, Approvals)
├── services/       # Complex logic handlers (walletService, authService)
├── store/          # Zustand global state (Auth, UI, Payroll Drafts)
├── types/          # Strict TypeScript interfaces & Enums
└── utils/          # Financial math & formatting utilities

```

---

## 🔐 Security & Routing Logic

The application implements a specialized routing tree to protect sensitive financial data:

1. **Public Routes**: (Landing, Pricing, Legal) Accessible to everyone.
2. **Auth Entry**: (Login, Signup) Redirects authenticated users automatically to the Dashboard.
3. **2FA Gate**: A specialized interceptor route that prevents access to the app until the 6-digit TOTP code is verified.
4. **Private Shell**: (Dashboard, Approvals) Wrapped in `RequireAuth` and `Layout` components.

---

## 🚀 Getting Started

### 1. Prerequisites

* **Node.js**: v18.0 or higher
* **Package Manager**: `npm` or `yarn`

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/payflow-frontend.git

# Install dependencies
npm install

```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://payflow-backend-production.up.railway.app

```

### 4. Development

```bash
npm run dev

```

---

## 💡 Key Features Implemented

* **Real-time Bank Verification**: Validates account numbers against Nigerian bank codes via Korapay/VFD before onboarding.
* **Multi-Admin Approvals**: Implements a "Maker-Checker" flow where payroll runs must be reviewed and authorized before release.
* **VFD Virtual Accounts**: Automated provisioning of corporate funding accounts.
* **Global Loading Interceptor**: Professional top-bar progress tracking for all network activity.
* **Audit Trail**: Immutable logging of every administrative action for compliance.

---

## ⚖️ Financial Precision Note

> **CRITICAL**: Never perform math on dollars/floats in this application. All currency values are passed as **cents** (integers). Use `src/utils/currency.ts` for all display conversions.

---

## 📝 License

Proprietary - Orchestra Business Solution Ltd. All rights reserved.
