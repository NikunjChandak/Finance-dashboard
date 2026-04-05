# Finance Dashboard UI

A visually appealing, highly interactive, and intuitive front-end finance dashboard simulating role-based access, persistence, and state management.

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js (v18+) installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
4. **View**: Open `http://localhost:5173` in your browser.

## Overview of Approach

The project is built with **React** via **Vite**, focusing on speed and modularity. I opted for **Vanilla CSS** with deep CSS variable integration (found in `src/index.css`) rather than a cumbersome utility class framework. This allows dynamic theming (Dark/Light mode switch), glassmorphism components, and a premium aesthetic with total control.

State management is handled by **Zustand**. For a dashboard, Zustand is optimal: it’s lightweight, requires zero boilerplate, and natively supports persisting data to `localStorage`. The entire mock database of transactions, theme preference, and current active role is retained across page reloads.

**Recharts** was employed to construct the interactive line and pie charts, translating standard mock transaction arrays into beautiful vector data visualizers.

## Features & Implementation

1. **Dashboard Overview**: Summary stats generated dynamically through `reduce()` array operations. Interactive charts scale responsively across all devices.
2. **Transactions Section**: Implemented real-time dynamic search and filter dropdowns.
3. **Role-based Authentication (RBAC) UI**: Located in the top navigation, a role switcher toggles between 'Viewer' and 'Admin'. When Admin is selected, "Add Transaction" mechanisms unlock as well as individual edit and delete actions on the transaction table.
4. **Insights Section**: Custom logic maps over the transaction history to identify key trends seamlessly (Highest Spending Category, MoM comparison percentages, and Savings Rate).
5. **Dark Mode**: Configured seamlessly using root CSS variables and conditionally bound class names toggled by Zustand.
6. **Data Persistence**: Refresh the page! By taking advantage of Zustand's `persist` middleware, adding or removing a transaction permanently saves to your browser.
