<p align="center">
  <h1 align="center">🎮 Nomini App</h1>
  <p align="center">
    Frontend application for <strong>Nomini</strong> — a dynamic and sleek social voting platform for predicting award show winners.
    <br />
    Features a bold, premium industrial design language tailored for gamers.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
</p>

---

## ✨ Features

- **Dynamic Voting Interface:** Browse categories, select nominees, and easily cast picks with visually rich, interactive cards.
- **Live Leaderboard:** Check global and yearly rankings tracked by points based on correct predictions.
- **Event Countdown:** Large, bold countdown on the Home page pulling the official event date from the server.
- **Winners Showcase:** Dedicated page to view declared winners per category, with suspenseful "TBA" fallbacks for unannounced categories.
- **Admin Dashboard:** Secure portal to manage the event date and select winners per category to automatically score user votes.
- **Profile Management:** Users can update their passwords securely from their dashboard.
- **Premium Industrial UI:** High-contrast dark mode aesthetic using typography combinations of Barlow, Montserrat, and uppercase formatting.
- **Responsive Design:** Completely optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [React 18](https://react.dev/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) with `@tailwindcss/forms` plugin |
| **Routing** | [React Router 6](https://reactrouter.com/) |
| **Data Fetching** | [Axios](https://axios-http.com/) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) |

---

## 📁 Project Structure

```text
nomini-app/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── @types/             # TypeScript definitions (NomineeType.ts)
│   ├── components/         # Reusable UI elements (Buttons, Cards, Inputs, Layouts)
│   ├── lib/                # Library configurations (Axios Interceptors)
│   ├── pages/              # Route/Page components
│   │   ├── About/          # About the app
│   │   ├── Admin/          # Admin Dashboard (Event Date & Winners)
│   │   ├── Auth/           # Login & Register views
│   │   ├── Home/           # Landing page & Event Countdown
│   │   ├── Leaderboard/    # Global and Yearly user rankings
│   │   ├── Nominees/       # Voting interface by category
│   │   ├── Profile/        # User profile & password reset
│   │   ├── Winners/        # Display of winning nominees
│   │   └── NotFound/       # 404 Error page
│   ├── routes/             # React Router configuration network
│   ├── services/           # External API data services
│   ├── App.tsx             # Root React App component wrapping Router
│   ├── index.css           # Global Tailwind & Font imports
│   └── main.tsx            # Application Entry Point
├── tailwind.config.js      # Custom theme, fonts, background images
├── vite.config.ts          # Vite build configuration
└── vercel.json             # Vercel deployment rewrite rules
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+**
- The [Nomini Backend API](https://github.com/your-username/nomini-api) must be running.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nomini-app.git
cd nomini-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project:

```env
VITE_API_URL=http://localhost:5000
```
> **Note:** If `VITE_API_URL` is omitted, Axios will default to `http://localhost:5000`.

### 4. Start the development server

```bash
npm run dev
```

The application will now be running on `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```
This generates the optimized static assets inside the `dist/` directory.

---

## 🎨 UI & Theming

Nomini leverages a heavy, premium theme utilizing specific Google fonts imported in `index.css` and extended in `tailwind.config.js`:

- **Barlow:** Used for massive headers, numbers (countdown), and section titles.
- **Montserrat:** Used for subtitles, tracking-widest text, and UI elements.
- **Dark Theme:** Grounded in zinc tones (`zinc-900`, `zinc-950`) contrasted with primary action colors (`orange-600`, `yellow-500` for admin).

---

## 🛡️ Authentication Flow

The frontend handles JWT authentication implicitly through Axios interconnectivity:
1. Upon successful Login/Registration at `/auth/login` or `/auth/register`, the backend issues a JSON Web Token (JWT).
2. The UI stores this token inside browser `localStorage`.
3. An **Axios Interceptor** (`src/lib/api.ts`) automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests.
4. If a 401 Unauthorized response is received, the interceptor wipes the token and redirects the user to `/login`.
5. Protected routes (like `/nominees` and `/leaderboard`) are wrapped with the `<RequireAuth />` component, which checks for the token prior to rendering.

---

## 🌐 API Interaction Examples

**Data Fetching Wrapper (`src/services/dataService.ts`)**:
```typescript
getCategories: async () => {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}
```

**Admin Post Request (`src/pages/Admin/index.tsx`)**:
```typescript
const handleSetWinner = async (category: string, nominee: string) => {
  const res = await api.post("/categories/winner", { category, nominee });
  // Updates UI states...
};
```

---

## 📜 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
