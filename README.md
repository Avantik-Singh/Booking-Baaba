# Booking Baba — Pure React.js (JSX) Replica

A full, pure **React.js (JSX/JavaScript)** replica of **Booking Baba** (Har Safar, Ek Jagah), India's unified travel platform for trains, flights, and buses.

This project is completely decoupled and self-contained in `D:\booking` without modifying or merging with the original Next.js project.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will launch at:
```
http://localhost:3000
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🛠️ Tech Stack & Key Features

| Aspect | Implementation |
|---|---|
| **Language** | **Pure JavaScript & JSX** (no `.ts` or `.tsx` files) |
| **Bundler & Server** | **Vite 6** (Fast HMR & ESM builds) |
| **Routing** | **React Router v7** (`react-router-dom`, `<Link to>`) |
| **Styling** | **Tailwind CSS v4** (`@tailwindcss/vite`) + `tw-animate-css` |
| **UI Primitives** | Base UI (`@base-ui/react`), Lucide React icons, Sonner toast notifications |
| **State Management** | Redux Toolkit (RTK Query) + Zustand |
| **Path Aliases** | `@/*` mapped to `./src/*` (configured in `vite.config.js` and `jsconfig.json`) |
| **Backend API Proxy** | Configured in `vite.config.js` (`/api` -> `http://localhost:8080`) |

---

## 📁 Project Structure

```
D:\booking\
├── src\
│   ├── components\
│   │   ├── admin\                 # Admin management dialogs (.jsx)
│   │   ├── auth\                  # Sign-in & Register dialogs (.jsx)
│   │   ├── booking\               # Multi-step booking drawer, confirmation, review, etc. (.jsx)
│   │   ├── explore\               # Trending destinations, popular routes, transport discovery (.jsx)
│   │   ├── layout\                # Navbar (with Dark mode & Links) and Footer (.jsx)
│   │   ├── notifications\         # Notification bell & alerts (.jsx)
│   │   ├── results\               # Bus, Flight, Train result cards & filters (.jsx)
│   │   ├── search\                # Unified search panel & transport tabs (.jsx)
│   │   ├── seats\                 # Bus seat map, Flight seat map, Train berth map (.jsx)
│   │   ├── ui\                    # Base UI primitives (buttons, dialogs, cards, sheets, etc.) (.jsx)
│   │   └── user\                  # User profile dialog (.jsx)
│   ├── lib\
│   │   ├── hooks\                 # useGoToResults hook (.js)
│   │   ├── mock-data\             # Mock data (.json)
│   │   ├── schemas\               # Zod validation schemas (.js)
│   │   ├── services\              # Booking, route, seat & search services (.js)
│   │   └── utils\                 # Currency formatter, fare calculation, filters (.js)
│   ├── pages\
│   │   ├── HomePage.jsx           # Main homepage with hero, search, explore & booking drawer
│   │   └── ResultsPage.jsx        # Compact search & results view
│   ├── store\
│   │   ├── api\                   # RTK Query APIs (.js)
│   │   ├── slices\                # Redux auth slice (.js)
│   │   ├── booking-store.js       # Zustand booking state
│   │   ├── search-store.js        # Zustand search state
│   │   └── StoreProvider.jsx      # Redux Store Provider
│   ├── App.jsx                    # React Router configuration
│   ├── main.jsx                   # React root entry point
│   └── index.css                  # Tailwind CSS v4 styling & dark mode definitions
├── public\
│   └── favicon.svg
├── .env                           # VITE_API_URL=http://localhost:8080/api
├── index.html
├── jsconfig.json
├── package.json
└── vite.config.js
```
