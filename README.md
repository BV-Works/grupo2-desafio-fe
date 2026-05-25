# grupo2-desafio-fe

# NovaPay Fraud Dashboard

Frontend side of the application for the **NovaPay Fraud Detection System**, developed as part of the *Desafío de Tripulaciones* challenge at TheBridge. 

The platform simulates an internal analyst tool used to review suspicious financial transactions generated and classified by the Data Science and Cybersecurity teams.

---

# Project Overview

NovaPay is a fictional fintech company experiencing increasing fraud activity.

This frontend application allows fraud analysts to:

- Review suspicious transactions
- Inspect transaction details
- Analyze client information
- Confirm fraud cases
- Mark false positives
- Visualize fraud-related metrics and tables

The project is built following an MVP-first approach under tight delivery constraints and cross-team collaboration.

---

# Current Features

## Authentication Flow

- Login page with separate `AuthLayout`
- Global authentication state using React Context API
- Protected dashboard structure
- Logout functionality

---

## Dashboard

### Transactions Table
- Pending suspicious transactions
- Risk score visualization
- Responsive table layout
- Clickable transaction rows
- Risk-based color system

### Clients Table
- Client overview data
- Responsive table layout

---

## Transaction Detail Page

- Transaction detail card
- Client detail card
- Analyst decision workflow
- Confirmation modal system

### Available Actions
- Confirm Fraud
- Allow Transaction / False Positive

---

## UI / UX Features

- Responsive dashboard layout using CSS Grid
- Reusable `TableShell` component
- CSS Modules architecture
- Shared design tokens using CSS variables
- Responsive mobile stacking behavior
- Transaction row hover interactions
- Modal overlay system

---

# Tech Stack

## Frontend
- React
- React Router DOM
- Vite
- CSS Modules

## State Management
- React Context API

## Styling
- CSS Modules
- CSS Variables (Design Tokens)

---

# Project Structure

```txt
src/
│
├── api/
├── assets/
├── components/
│   ├── ClientCard/
│   ├── ClientsTable/
│   ├── DecisionModal/
│   ├── Footer/
│   ├── Header/
│   ├── TableShell/
│   ├── TransactionCard/
│   └── TransactionsTable/
│
├── context/
│   ├── authContext.jsx
│   ├── AuthProvider.jsx
│   └── useAuth.jsx
│
├── data/
│   ├── mockClients.json
│   └── mockTransactions.json
│
├── layouts/
│   ├── AuthLayout/
│   └── MainLayout/
│
├── pages/
│   ├── DashboardPage/
│   ├── LoginPage/
│   └── TransactionDetailPage/
│
├── routes/
├── styles/
├── utils/
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# Routing

```txt
/                     → Login Page
/dashboard            → Main Dashboard
/transactions/:id     → Transaction Detail Page
```

---

# Design System

The project uses centralized CSS variables for:

- Colors
- Shadows
- Border radius
- Spacing system

Example:

```css
:root {
  --color-bg-main: #f8fafc;
  --color-bg-surface: #eef2f7;
  --color-bg-card: #f9fbfd;

  --color-status-critical: #dc2626;
  --color-status-warning: #d97706;
  --color-status-success: #16a34a;

  --radius-md: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
}
```

---

# Responsive Strategy

Desktop:
- Dashboard grid layout (`2fr / 1fr`)

Mobile:
- Tables stack vertically
- Horizontal table scrolling enabled
- Action buttons stack vertically
- Cards become single-column

---

# Mock Data

Current development uses local JSON mock data:

- `mockTransactions.json`
- `mockClients.json`

This allows frontend development to progress independently while backend and database integration are still in progress.

---

# Planned Features

- Real backend API integration
- JWT authentication
- Analyst session persistence
- Transaction filtering and search
- Charts and fraud metrics visualization
- Transaction decision persistence
- Role-based access
- Pagination
- Real database integration
- Dockerized backend services

---

# Team Workflow

The project is developed collaboratively across:

- Full Stack
- Data Science
- Cybersecurity

Frontend currently progresses in parallel using mocked data while:
- Data Science defines datasets and fraud models
- Backend/database models are finalized
- Dockerized infrastructure is prepared

---

# Running the Project

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

---

# Development Philosophy

This project follows:
- MVP-first development
- Component-based architecture
- Separation of concerns
- Responsive-first design
- Reusable UI patterns
- Clean dashboard UX principles

---

# Author

Developed as part of the *Desafío de Tripulaciones* Full Stack team.
