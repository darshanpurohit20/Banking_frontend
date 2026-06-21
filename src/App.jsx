import React, { useState } from "react";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

/**
 * Main App component.
 * Manages client-side session state and routes to Login or Dashboard.
 */
function App() {
  // Initialize user session from localStorage if present
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("banking_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("App: Failed to parse user session", e);
      return null;
    }
  });

  /**
   * Set user session after successful login.
   * @param {Object} user - { email }
   */
  function handleLoginSuccess(user) {
    console.log("App: User logged in", user);
    localStorage.setItem("banking_user", JSON.stringify(user));
    setCurrentUser(user);
  }

  /**
   * Clear user session.
   */
  function handleLogout() {
    console.log("App: User logging out");
    localStorage.removeItem("banking_user");
    setCurrentUser(null);
  }

  return (
    <div className="app-root">
      {currentUser ? (
        <Dashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
