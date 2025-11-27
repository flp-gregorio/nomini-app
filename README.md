# CritPick 🎮🏆

Welcome to the **CritPick** frontend! This project is a fun and friendly Pick'em app where participants can predict the winners of the Game Awards. Built with React, TypeScript, and styled with TailwindCSS.

## Project Structure

```
goty-bet/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env
├── index.html
├── package.json
├── tailwind.config.js
├── vercel.json
├── vite.config.ts
└── README.md
```

## Features
- 🏆 **Leaderboard**: Displays the top participants based on their predictions.
- 📊 **Nominees Page**: Allows users to place their bets on different categories.
- 🎉 **Winners Page**: Shows the winners after the Game Awards results are announced.
- 🌐 **Responsive Design**: Looks great on both desktop and mobile devices.

## Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd goty-bet
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Usage
1.  **Register/Login**: Create an account or log in.
2.  **Place your bets**: Go to the Nominees Page and make your predictions for each category.
3.  **Check the leaderboard**: See how you rank against other participants.
4.  **View winners**: After the Game Awards, check the Winners Page to see the results.

## License
This project is licensed under the MIT License.
