
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Header() {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsub();
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <header className="main-header">
      <div className="app-title">
        <span>Welcome to Smart Issue Board</span>
      </div>
      
      <nav className="nav-menu">
        
        {userEmail ? (
          <>
            <Link to="/create" className={isActive("/create")}>
              ➕ Create Issue
            </Link>
            <Link to="/issues" className={isActive("/issues")}>
              📋 View Issues
            </Link>
            <Link to="/dashboard" className="nav-link" onClick={async () => {
              // Logout logic will be handled in Dashboard
            }}>
              👤 {userEmail.split('@')[0]}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive("/login")}>
              🔐 Login
            </Link>
            <Link to="/signup" className={isActive("/signup")}>
              📝 Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}


