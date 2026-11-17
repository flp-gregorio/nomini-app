import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import DevTools from "./components/DevTools";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <DevTools />
    </AuthProvider>
  );
}

export default App;