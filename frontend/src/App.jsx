import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to signin if not logged in */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />

        {/* Catch-all route for unknown URLs */}
        <Route path="*" element={<h1 className="text-center text-red-500 text-2xl">404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
