import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "./firebase";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import ExpenseHistory from "./pages/ExpenseHistory";
import Profile from "./pages/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log("Auth state changed:", currentUser);
        setUser(currentUser);
        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      {user && <Sidebar />} {/* Sidebar only visible after login */}
      <div className={user ? "content-container" : "auth-container"}>
        <Routes>
          {/* Redirect root URL to Login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path="/add-expense" element={<ProtectedRoute user={user}><AddExpense /></ProtectedRoute>} />
          <Route path="/expense-history" element={<ProtectedRoute user={user}><ExpenseHistory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

export default App;
