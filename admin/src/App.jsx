import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/products" element={<AdminProducts />} />
        {/* Placeholder for other routes */}
        <Route path="/orders" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
